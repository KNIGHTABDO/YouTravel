# Build an AI-Native Autonomous Travel Research Web App

## Your Role
You are a **senior full-stack engineer, AI systems architect, and product designer**.

You must **design and build a complete web application** whose intelligence runs on the **GitHub Models API** using **GPT-5**, with extensive **tool calling**.

Do not ask clarifying questions.  
Do not explain basics.  
Do not mention files or folders.  
You already know how to build production systems.

---

## AI RUNTIME CONSTRAINTS (IMPORTANT)
The AI inference layer uses **GitHub Models API**, which is:
- OpenAI-compatible (`chat.completions`)
- Accessed via `https://models.github.ai/inference`
- Authenticated using a GitHub token
- Safe to call from the browser
- Supports **tool / function calling**
- Uses **GPT-5** as the reasoning model

The AI must be designed to:
- Use tool calling via the Chat Completions API
- Decide autonomously when to call tools
- Chain multiple tool calls
- Resume reasoning after tool responses
- Delay final output until research is complete

---

## Product Vision
This is NOT a traditional travel app.

It is an **AI-native autonomous travel research agent**.

The user provides **only one input**:
- a country OR a city

From this single input:
- the AI plans its own research
- the AI performs deep multi-step analysis
- the AI calls many tools
- the AI verifies and cross-checks information
- the AI synthesizes a final high-quality travel guide

The user is never asked for preferences, budget, filters, or choices.

---

## Core User Experience
- The UI has **one simple destination input**
- After submission, the app enters a **research mode**
- The interface shows animated progress states such as:
  - Searching the web
  - Analyzing destinations
  - Comparing neighborhoods
  - Estimating real-world costs
  - Verifying information
- The AI works silently for a period of time
- When finished, the user receives a **complete, premium travel guide**

No interruptions.  
No back-and-forth.  
The waiting period signals intelligence and depth.

---

## AI BEHAVIOR (CRITICAL)
The AI must behave as an **autonomous research agent**, not a chatbot.

It must:
- Plan its own steps internally
- Decide which tools to call
- Call tools many times
- Loop when data is insufficient
- Aggregate and normalize tool results
- Cross-check multiple sources
- Avoid hallucination by grounding conclusions
- Only respond when confident in the output

The AI is slow, deliberate, and methodical **by design**.

---

## TOOLING & FUNCTION CALLING
Design the system so the AI can orchestrate many tools via function calling, including but not limited to:

- Web search (multi-source queries)
- Location and place discovery
- Mapping and geolocation
- Cost and budget estimation
- Ranking and comparison
- Safety and travel advisory analysis
- Image and media retrieval
- Text extraction and summarization

You are encouraged to:
- Define additional tools
- Chain tools together
- Re-run tools for validation
- Use structured outputs for tool responses

The AI must dynamically choose:
- which tool to call
- when to call it
- how many times to call it
- when research is sufficient

---

## Research Depth Requirements
For any destination, the AI must independently research and understand:

- Destination overview and context
- Best cities or districts (ranked with explanations)
- Where to stay (neighborhoods + realistic price ranges)
- Accommodation costs
- Transportation systems
- Must-see attractions and hidden gems
- Daily life costs (food, transport, activities)
- Safety considerations
- Cultural norms
- Common tourist mistakes
- Who the destination is best suited for

Synthesize insights — do not dump raw data.

---

## Final Output Requirements
The final output must feel like a **premium editorial travel guide**, not an AI answer.

It must include:
- Clear destination overview
- Ranked cities or areas with reasoning
- Where to stay (neighborhoods + price ranges)
- What to see (popular and lesser-known)
- Budget estimates (daily and total, with ranges)
- Transportation guidance
- Safety and cultural advice
- Common mistakes to avoid
- Maps and locations
- High-quality visual sections and images

Every recommendation must explain **why**.

---

## UI / UX REQUIREMENTS (VERY IMPORTANT)
Design the UI to be:

- Extremely clean
- Minimal
- Calm
- Elegant
- Easy to scan

Design must:
- Be fully responsive for **laptops, iPhones, and iPads**
- Be mobile-first with desktop refinement
- Use country-based color themes
- Use card-based sections
- Avoid text walls
- Use smooth transitions and loading animations
- Clearly separate research phase from results

The UI should feel:
- Premium
- Modern
- Editorial
- User-friendly
- Highly polished

---

## What This App Is NOT
- Not a booking platform
- Not a chatbot
- Not a filter-based planner
- Not a form-driven app
- Not an itinerary generator with user inputs

This is an **AI-powered autonomous travel research system**.

---

## Expectations
You are expected to:
- Architect the full system
- Design AI reasoning and tool orchestration
- Implement GitHub Models API usage correctly
- Build the complete UI
- Optimize for clarity, depth, and trust
- Add any missing intelligence or tools that improve quality

Always prioritize:
- Quality over speed
- Depth over brevity
- Intelligence over interactivity
