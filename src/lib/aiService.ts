// AI Enhancement Service for Travel Guides
// Uses GitHub Models API with gpt-4o-mini (8K context limit)

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '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';
const API_ENDPOINT = 'https://models.inference.ai.azure.com/chat/completions';
const MODEL = 'gpt-5';
const MAX_CONTEXT_TOKENS = 6000; // Leave room for response (8K limit)

interface AIEnhancementRequest {
  destination: string;
  section: 'overview' | 'culture' | 'safety' | 'tips' | 'attractions';
  context: string;
}

interface AIEnhancementResponse {
  success: boolean;
  content?: string;
  error?: string;
}

// Estimate token count (rough approximation: 1 token ≈ 4 chars)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// Truncate text to fit within token limit
function truncateToTokenLimit(text: string, maxTokens: number): string {
  const estimatedTokens = estimateTokens(text);
  if (estimatedTokens <= maxTokens) return text;
  
  // Truncate to approximately the right size
  const ratio = maxTokens / estimatedTokens;
  const targetLength = Math.floor(text.length * ratio * 0.9); // 10% safety margin
  return text.substring(0, targetLength) + '...';
}

// Create focused prompts for each section type
function createPrompt(section: string, destination: string, context: string): string {
  const truncatedContext = truncateToTokenLimit(context, MAX_CONTEXT_TOKENS - 500);
  
  const prompts: Record<string, string> = {
    overview: `You are a travel writer. Based on the following data about ${destination}, write a compelling 2-3 sentence overview summary that captures the essence of this destination. Be specific and evocative.

Data: ${truncatedContext}

Write ONLY the summary paragraph, nothing else:`,

    culture: `You are a cultural expert. Based on the following data about ${destination}, write 3 specific cultural tips for visitors. Be practical and insightful.

Data: ${truncatedContext}

Write exactly 3 tips as a JSON array of strings. Example: ["tip 1", "tip 2", "tip 3"]`,

    safety: `You are a travel safety expert. Based on the following safety data about ${destination}, write a one-paragraph safety summary that's honest but not alarming.

Data: ${truncatedContext}

Write ONLY the summary paragraph:`,

    tips: `You are an experienced traveler. Based on the following data about ${destination}, suggest 3 insider tips that most tourists don't know.

Data: ${truncatedContext}

Write exactly 3 tips as a JSON array of strings:`,

    attractions: `You are a travel guide writer. Based on the following attraction data for ${destination}, write a brief 1-sentence "why visit" for the top attraction.

Data: ${truncatedContext}

Write ONLY the one sentence:`,
  };
  
  return prompts[section] || prompts.overview;
}

// Call the AI API
export async function enhanceWithAI(request: AIEnhancementRequest): Promise<AIEnhancementResponse> {
  const { destination, section, context } = request;
  
  // Check if we have enough context
  if (!context || context.length < 50) {
    return { success: false, error: 'Insufficient context for AI enhancement' };
  }
  
  const prompt = createPrompt(section, destination, context);
  
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful travel expert. Be concise, specific, and practical. Always respond in the exact format requested.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
      signal: AbortSignal.timeout(15000),
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.log(`AI API error: ${response.status} - ${error}`);
      return { success: false, error: `API error: ${response.status}` };
    }
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    
    if (!content) {
      return { success: false, error: 'Empty response from AI' };
    }
    
    console.log(`AI enhancement for ${section}: ${content.substring(0, 100)}...`);
    return { success: true, content };
    
  } catch (error: any) {
    console.log(`AI enhancement error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Enhance multiple sections in parallel with rate limiting
export async function enhanceGuideWithAI(
  destination: string,
  collectedData: Record<string, any>
): Promise<Record<string, string>> {
  const enhancements: Record<string, string> = {};
  
  // Prepare context for each section
  const sections = [
    {
      key: 'overviewSummary',
      section: 'overview' as const,
      context: JSON.stringify({
        wikipedia: collectedData.search_destination?.wikipedia?.extract?.substring(0, 1000),
        country: collectedData.get_country_info?.info?.name,
        capital: collectedData.get_country_info?.info?.capital,
        region: collectedData.get_country_info?.info?.region,
      }),
    },
    {
      key: 'cultureTips',
      section: 'culture' as const,
      context: JSON.stringify({
        etiquette: collectedData.get_culture_info?.etiquette,
        customs: collectedData.get_culture_info?.customs,
        taboos: collectedData.get_culture_info?.taboos,
      }),
    },
  ];
  
  // Process sequentially to respect rate limits
  for (const { key, section, context } of sections) {
    if (context && context !== '{}') {
      const result = await enhanceWithAI({ destination, section, context });
      if (result.success && result.content) {
        enhancements[key] = result.content;
      }
      // Small delay between requests
      await new Promise(r => setTimeout(r, 500));
    }
  }
  
  return enhancements;
}

// Simple text enhancement for summaries
export async function enhanceSummary(destination: string, rawSummary: string): Promise<string> {
  if (!rawSummary || rawSummary.length < 20) {
    return rawSummary;
  }
  
  const result = await enhanceWithAI({
    destination,
    section: 'overview',
    context: rawSummary,
  });
  
  return result.success && result.content ? result.content : rawSummary;
}
