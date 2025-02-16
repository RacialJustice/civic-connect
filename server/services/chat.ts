import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const systemPrompt = `You are a helpful assistant for CivicConnect, a civic engagement platform that connects citizens with local government representatives. 
Key features include:
- Directory of officials across national, county, constituency, and ward levels
- Community forums for civic discussions
- Educational resources about governance
- Location-based representative matching

Provide concise, helpful responses about these features and how to use the platform. Be friendly and encouraging of civic engagement.`;

export async function getChatResponse(message: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 150, // Keep responses concise
      temperature: 0.7,
    });

    return completion.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error('OpenAI API error:', error);
    return "I'm having trouble connecting to my knowledge base. Please try again in a moment.";
  }
}
