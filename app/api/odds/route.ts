import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseOdds } from '@/lib/parser';
import { analyzeMatch } from '@/lib/analyzer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input } = body;

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input. Please provide odds data as a string.' },
        { status: 400 }
      );
    }

    // Parse the input
    const parsedOdds = parseOdds(input);

    if (parsedOdds.length === 0) {
      return NextResponse.json(
        { error: 'No valid odds found in input.' },
        { status: 400 }
      );
    }

    // Store all odds in database and create predictions
    const createdOdds = [];
    const createdPredictions = [];

    for (const odd of parsedOdds) {
      // Create odd record
      const createdOdd = await prisma.odd.create({
        data: odd,
      });
      createdOdds.push(createdOdd);

      // Analyze match and create prediction
      try {
        const analysis = await analyzeMatch(
          odd.homeTeam,
          odd.awayTeam,
          odd.goalLine
        );

        const prediction = await prisma.prediction.create({
          data: {
            oddId: createdOdd.id,
            combinedExpectedGoals: analysis.combinedExpectedGoals,
            over15Probability: analysis.over15Probability,
            over25Probability: analysis.over25Probability,
            decision: analysis.decision,
            confidenceScore: analysis.confidenceScore,
          },
        });

        createdPredictions.push({
          ...prediction,
          homeTeam: odd.homeTeam,
          awayTeam: odd.awayTeam,
        });
      } catch (analysisError) {
        console.error('Error analyzing match:', analysisError);
        // Continue with other matches even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      oddsCount: createdOdds.length,
      predictionsCount: createdPredictions.length,
      predictions: createdPredictions,
      message: `Successfully stored ${createdOdds.length} odds and generated ${createdPredictions.length} predictions.`,
    });
  } catch (error) {
    console.error('Error processing odds:', error);
    return NextResponse.json(
      { error: 'Failed to process odds.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const odds = await prisma.odd.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      count: odds.length,
      data: odds,
    });
  } catch (error) {
    console.error('Error fetching odds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch odds.' },
      { status: 500 }
    );
  }
}
