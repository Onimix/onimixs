import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseResults } from '@/lib/parser';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input } = body;

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input. Please provide results data as a string.' },
        { status: 400 }
      );
    }

    // Parse the input
    const parsedResults = parseResults(input);

    if (parsedResults.length === 0) {
      return NextResponse.json(
        { error: 'No valid results found in input.' },
        { status: 400 }
      );
    }

    // Store all results in database
    const createdResults = await prisma.result.createMany({
      data: parsedResults,
    });

    return NextResponse.json({
      success: true,
      count: createdResults.count,
      message: `Successfully stored ${createdResults.count} results.`,
    });
  } catch (error) {
    console.error('Error processing results:', error);
    return NextResponse.json(
      { error: 'Failed to process results.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const results = await prisma.result.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results.' },
      { status: 500 }
    );
  }
}
