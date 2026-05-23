import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, context } = body;

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'Gemini API key not configured on server' },
        { status: 500 }
      );
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Construct the prompt
    const prompt = `
    You are an expert epidemiological assistant for Epidemia-Labs.
    Keep your responses concise and informative (2-3 paragraphs max).
    Use the following context if relevant:
    ${context}

    User Question: ${question}
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ answer: text });
  } catch (error: any) {
    console.error('Error generating AI response:', error);

    // Handle specific Gemini API errors
    const errorMsg = error?.message || '';

    if (errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('quota') || errorMsg.includes('rate')) {
      return NextResponse.json(
        { answer: '⏳ The AI service is currently rate-limited (free tier quota reached). Please wait a minute and try again. The service resets periodically.' },
        { status: 200 }
      );
    }

    if (errorMsg.includes('404') || errorMsg.includes('not found')) {
      return NextResponse.json(
        { answer: '⚠️ The AI model is temporarily unavailable. Please try again in a moment.' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { answer: `⚠️ AI service error: ${errorMsg.slice(0, 150)}. Please try again later.` },
      { status: 200 }
    );
  }
}
