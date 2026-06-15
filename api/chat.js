import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, context } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      system: `You are ExamNinja AI — a personal CLAT tutor built into the ExamNinja prep platform for Indian students.

Your job is to replace the need for a teacher. Be genuinely helpful, warm, and clear.

You help with all 5 CLAT sections:
- Legal Reasoning: Explain how to apply principles to facts. Walk through the principle → facts → conclusion method.
- Logical Reasoning: Break down argument structure, premises, conclusions, assumptions step by step.
- English Language: Explain passage analysis, inference techniques, vocabulary in context.
- Quantitative Techniques: Show working step by step. Use simple Indian examples (₹, Indian names).
- Current Affairs & GK: Explain legal news, constitutional articles, landmark judgements.

Rules:
- Keep responses concise but complete — this is a chat, not an essay.
- Never make the student feel bad for not knowing something.
- Use numbered steps for explanations.
- If explaining a wrong answer, first acknowledge what they might have been thinking, then explain the correct reasoning.
- Use plain language. Avoid jargon unless teaching it.
- Add encouragement naturally — not forced.

${context ? `CURRENT CONTEXT: ${context}` : ''}`,
      messages: messages,
    });

    return res.status(200).json({ content: response.content[0].text });
  } catch (error) {
    console.error('AI error:', error.message);
    return res.status(500).json({ error: 'AI unavailable right now. Please try again.' });
  }
}
