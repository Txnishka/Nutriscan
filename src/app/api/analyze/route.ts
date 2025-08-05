import { NextResponse } from 'next/server';

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

export const runtime = 'edge'; // Enable Edge Runtime

export async function POST(request: Request) {
  if (!PERPLEXITY_API_KEY) {
    return NextResponse.json(
      { error: 'Perplexity API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }

    const prompt = `Analyze the following nutrition label text and provide a detailed breakdown of the nutritional information. Include:
1. Key nutrients and their values
2. Daily value percentages
3. Health implications
4. Any notable ingredients or allergens
5. Overall nutritional assessment

Nutrition label text:
${text}

Please format the response in clear, readable paragraphs.`;

    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are a nutrition expert analyzing food labels. Provide clear, accurate, and helpful nutritional information.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const responseText = await response.text();
    let data;
    
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Perplexity API response:', responseText);
      return NextResponse.json(
        { error: 'Invalid response from Perplexity API' },
        { status: 500 }
      );
    }

    if (!response.ok) {
      console.error('Perplexity API error:', data);
      return NextResponse.json(
        { error: data.error?.message || 'Perplexity API request failed' },
        { status: response.status }
      );
    }

    if (!data.choices?.[0]?.message?.content) {
      console.error('Unexpected Perplexity API response format:', data);
      return NextResponse.json(
        { error: 'Unexpected response format from Perplexity API' },
        { status: 500 }
      );
    }

    const analysis = data.choices[0].message.content;
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze nutrition information' },
      { status: 500 }
    );
  }
} 