import { NextRequest, NextResponse } from 'next/server';
import { travelResearchTools, researchSteps } from '@/lib/tools';
import { executeTool, generateCompleteGuide, getThemeForDestination } from '@/lib/toolExecutor';
import { TravelGuide, ResearchStep } from '@/types';

// GitHub Models API configuration
const GITHUB_MODELS_ENDPOINT = 'https://models.github.ai/inference';
const MODEL = 'openai/gpt-4.1';

// System prompt for the travel research agent
const SYSTEM_PROMPT = `You are an autonomous travel research agent. Your job is to thoroughly research a destination and create a premium travel guide.

When given a destination, you must:
1. Research comprehensively using all available tools
2. Gather information on cities, neighborhoods, attractions, costs, safety, culture, and transportation
3. Cross-verify information from multiple tool calls
4. Synthesize findings into a cohesive guide

Be thorough and methodical. Call multiple tools to gather complete information. Do not rush.

After completing your research, provide a final summary confirming you've gathered:
- Destination overview and best times to visit
- Top cities/areas ranked with reasons
- Neighborhood recommendations with price ranges
- Must-see attractions (popular and hidden gems)
- Detailed budget estimates
- Transportation options
- Safety information
- Cultural tips and etiquette
- Common tourist mistakes to avoid
- Who the destination is best for`;

interface Message {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: { name: string; arguments: string };
  }>;
  tool_call_id?: string;
  name?: string;
}

async function callGitHubModels(messages: Message[], hasTools: boolean = true): Promise<{
  content: string | null;
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: { name: string; arguments: string };
  }>;
}> {
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    // Simulate AI response for development without token
    return simulateAIResponse(messages);
  }
  
  const response = await fetch(`${GITHUB_MODELS_ENDPOINT}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      tools: hasTools ? travelResearchTools : undefined,
      tool_choice: hasTools ? 'auto' : undefined,
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    console.error('GitHub Models API error:', error);
    throw new Error(`API error: ${response.status}`);
  }
  
  const data = await response.json();
  const choice = data.choices[0];
  
  return {
    content: choice.message.content,
    tool_calls: choice.message.tool_calls,
  };
}

// Simulate AI responses for development without API token
function simulateAIResponse(messages: Message[]): {
  content: string | null;
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: { name: string; arguments: string };
  }>;
} {
  const lastMessage = messages[messages.length - 1];
  
  // Check if we've been calling tools (look for tool messages)
  const toolCallCount = messages.filter(m => m.role === 'tool').length;
  
  // If we have enough tool calls, return final response
  if (toolCallCount >= 8) {
    return {
      content: 'Research complete. I have gathered comprehensive information about the destination including overview, top cities, neighborhoods, attractions, costs, transportation, safety, culture, and practical tips. The travel guide is ready.',
      tool_calls: undefined,
    };
  }
  
  // Extract destination from user message
  const userMessage = messages.find(m => m.role === 'user');
  const destination = userMessage?.content?.replace('Research this destination thoroughly: ', '') || 'destination';
  
  // Simulate progressive tool calls based on count
  const toolSequence = [
    { name: 'web_search', args: { query: `${destination} travel guide overview`, category: 'general', region: destination } },
    { name: 'rank_destinations', args: { country: destination, criteria: 'popularity,uniqueness,accessibility', destinationType: 'cities' } },
    { name: 'discover_places', args: { destination, placeType: 'attractions', limit: '10' } },
    { name: 'compare_neighborhoods', args: { city: destination, criteria: 'price,safety,accessibility' } },
    { name: 'estimate_costs', args: { destination, category: 'all', budgetLevel: 'all' } },
    { name: 'get_transportation_info', args: { destination, transportType: 'all' } },
    { name: 'analyze_safety', args: { destination, aspects: 'crime,health,scams' } },
    { name: 'get_cultural_info', args: { destination, topics: 'etiquette,tipping,taboos,dress' } },
    { name: 'get_local_tips', args: { destination, tipCategory: 'all' } },
    { name: 'analyze_traveler_fit', args: { destination, travelerTypes: 'solo,couples,families,budget,luxury' } },
    { name: 'search_images', args: { query: destination, location: destination, imageType: 'landscape', count: '5' } },
  ];
  
  const nextTool = toolSequence[toolCallCount] || toolSequence[toolSequence.length - 1];
  
  return {
    content: null,
    tool_calls: [{
      id: `call_${Date.now()}_${toolCallCount}`,
      type: 'function',
      function: {
        name: nextTool.name,
        arguments: JSON.stringify(nextTool.args),
      },
    }],
  };
}

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const { destination } = await request.json();
        
        if (!destination) {
          controller.enqueue(encoder.encode(JSON.stringify({ 
            type: 'error', 
            data: { error: 'Destination is required' } 
          }) + '\n'));
          controller.close();
          return;
        }
        
        // Send initial step
        const steps = [...researchSteps];
        let currentStepIndex = 0;
        
        const sendStep = (index: number, status: 'active' | 'complete') => {
          const step: ResearchStep = {
            ...steps[index],
            status,
            toolCalls: [],
          };
          controller.enqueue(encoder.encode(JSON.stringify({
            type: 'step',
            data: { step, stepIndex: index }
          }) + '\n'));
        };
        
        const sendProgress = (progress: number) => {
          controller.enqueue(encoder.encode(JSON.stringify({
            type: 'progress',
            data: { progress }
          }) + '\n'));
        };
        
        const sendToolCall = (toolName: string) => {
          controller.enqueue(encoder.encode(JSON.stringify({
            type: 'tool_call',
            data: { 
              toolCall: { 
                toolName, 
                startTime: Date.now(), 
                status: 'running' 
              } 
            }
          }) + '\n'));
        };
        
        // Initialize research
        sendStep(0, 'active');
        sendProgress(5);
        
        // Build conversation with AI
        const messages: Message[] = [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Research this destination thoroughly: ${destination}` }
        ];
        
        let toolCallCount = 0;
        const maxToolCalls = 15;
        let researchComplete = false;
        
        // Simulate progressive research with tool calls
        while (!researchComplete && toolCallCount < maxToolCalls) {
          // Call the AI
          const response = await callGitHubModels(messages, true);
          
          if (response.tool_calls && response.tool_calls.length > 0) {
            // AI wants to call tools
            for (const toolCall of response.tool_calls) {
              const toolName = toolCall.function.name;
              const toolArgs = JSON.parse(toolCall.function.arguments);
              
              // Update UI step based on tool
              const stepMapping: Record<string, number> = {
                'web_search': 1,
                'rank_destinations': 2,
                'discover_places': 3,
                'compare_neighborhoods': 4,
                'estimate_costs': 5,
                'get_transportation_info': 6,
                'analyze_safety': 7,
                'get_cultural_info': 8,
                'get_local_tips': 9,
                'analyze_traveler_fit': 9,
                'search_images': 10,
                'synthesize_guide_section': 11,
              };
              
              const stepIndex = stepMapping[toolName] || currentStepIndex;
              
              // Complete previous step and activate new one
              if (stepIndex > currentStepIndex) {
                sendStep(currentStepIndex, 'complete');
                currentStepIndex = stepIndex;
                sendStep(currentStepIndex, 'active');
              }
              
              sendToolCall(toolName);
              
              // Execute the tool
              const toolResult = await executeTool(toolName, toolArgs);
              
              // Add to messages
              messages.push({
                role: 'assistant',
                content: null,
                tool_calls: [toolCall],
              });
              
              messages.push({
                role: 'tool',
                content: toolResult,
                tool_call_id: toolCall.id,
                name: toolName,
              });
              
              toolCallCount++;
              sendProgress(Math.min(10 + (toolCallCount / maxToolCalls) * 80, 90));
            }
          } else {
            // AI finished with tools, final response
            researchComplete = true;
          }
        }
        
        // Complete remaining steps
        for (let i = currentStepIndex; i < steps.length; i++) {
          sendStep(i, 'complete');
          await new Promise(r => setTimeout(r, 200));
        }
        
        sendProgress(95);
        
        // Generate the final travel guide
        const guide = generateCompleteGuide(destination);
        
        sendProgress(100);
        
        // Send complete event with guide
        controller.enqueue(encoder.encode(JSON.stringify({
          type: 'complete',
          data: { guide }
        }) + '\n'));
        
        controller.close();
        
      } catch (error) {
        console.error('Research error:', error);
        controller.enqueue(encoder.encode(JSON.stringify({
          type: 'error',
          data: { error: error instanceof Error ? error.message : 'Research failed' }
        }) + '\n'));
        controller.close();
      }
    }
  });
  
  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
