import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get all predictions with their associated odds
    const predictions = await prisma.prediction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    // Fetch associated odds for each prediction
    const predictionsWithDetails = await Promise.all(
      predictions.map(async (prediction) => {
        const odd = await prisma.odd.findUnique({
          where: { id: prediction.oddId },
        });

        return {
          ...prediction,
          homeTeam: odd?.homeTeam || 'Unknown',
          awayTeam: odd?.awayTeam || 'Unknown',
          time: odd?.time || '',
        };
      })
    );

    return NextResponse.json({
      success: true,
      count: predictionsWithDetails.length,
      data: predictionsWithDetails,
    });
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch predictions.' },
      { status: 500 }
    );
  }
}
