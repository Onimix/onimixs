import { prisma } from './prisma';

export interface TeamStats {
  avgGoalsScored: number;
  avgGoalsConceded: number;
  over15Rate: number;
  over25Rate: number;
  matchCount: number;
}

export interface AnalysisResult {
  homeTeam: string;
  awayTeam: string;
  combinedExpectedGoals: number;
  over15Probability: number;
  over25Probability: number;
  decision: string;
  confidenceScore: number;
}

/**
 * Get historical statistics for a team
 */
async function getTeamStats(teamName: string): Promise<TeamStats> {
  // Get matches where team played at home
  const homeMatches = await prisma.result.findMany({
    where: { homeTeam: teamName },
  });

  // Get matches where team played away
  const awayMatches = await prisma.result.findMany({
    where: { awayTeam: teamName },
  });

  const totalMatches = homeMatches.length + awayMatches.length;

  if (totalMatches === 0) {
    return {
      avgGoalsScored: 1.5,
      avgGoalsConceded: 1.5,
      over15Rate: 50,
      over25Rate: 40,
      matchCount: 0,
    };
  }

  // Calculate goals scored
  const homeGoalsScored = homeMatches.reduce((sum, m) => sum + m.homeGoals, 0);
  const awayGoalsScored = awayMatches.reduce((sum, m) => sum + m.awayGoals, 0);
  const totalGoalsScored = homeGoalsScored + awayGoalsScored;
  const avgGoalsScored = totalGoalsScored / totalMatches;

  // Calculate goals conceded
  const homeGoalsConceded = homeMatches.reduce((sum, m) => sum + m.awayGoals, 0);
  const awayGoalsConceded = awayMatches.reduce((sum, m) => sum + m.homeGoals, 0);
  const totalGoalsConceded = homeGoalsConceded + awayGoalsConceded;
  const avgGoalsConceded = totalGoalsConceded / totalMatches;

  // Calculate over rates
  const allMatches = [...homeMatches, ...awayMatches];
  const over15Count = allMatches.filter(m => m.over15).length;
  const over25Count = allMatches.filter(m => m.over25).length;
  const over15Rate = (over15Count / totalMatches) * 100;
  const over25Rate = (over25Count / totalMatches) * 100;

  return {
    avgGoalsScored,
    avgGoalsConceded,
    over15Rate,
    over25Rate,
    matchCount: totalMatches,
  };
}

/**
 * Analyze a match and generate prediction
 */
export async function analyzeMatch(
  homeTeam: string,
  awayTeam: string,
  goalLine: number
): Promise<AnalysisResult> {
  // Get stats for both teams
  const homeStats = await getTeamStats(homeTeam);
  const awayStats = await getTeamStats(awayTeam);

  // Calculate combined expected goals
  // Home team expected to score based on their avg + away team's defensive weakness
  const homeExpectedGoals = (homeStats.avgGoalsScored + awayStats.avgGoalsConceded) / 2;
  
  // Away team expected to score based on their avg + home team's defensive weakness
  const awayExpectedGoals = (awayStats.avgGoalsScored + homeStats.avgGoalsConceded) / 2;
  
  const combinedExpectedGoals = homeExpectedGoals + awayExpectedGoals;

  // Calculate over probabilities
  // Weight historical over rates with expected goals
  const over15Probability = (
    (homeStats.over15Rate + awayStats.over15Rate) / 2 * 0.6 +
    (combinedExpectedGoals >= 2 ? 30 : 10) * 0.4
  );

  const over25Probability = (
    (homeStats.over25Rate + awayStats.over25Rate) / 2 * 0.6 +
    (combinedExpectedGoals >= 3 ? 30 : 10) * 0.4
  );

  // Decision logic
  let decision: string;
  if (combinedExpectedGoals >= 2.4 && over15Probability >= 70) {
    decision = 'LOCK 2+ GOALS';
  } else if (combinedExpectedGoals >= 2) {
    decision = 'SAFE OVER 1.5';
  } else {
    decision = 'AVOID';
  }

  // Calculate confidence score
  const dataQuality = Math.min(homeStats.matchCount, awayStats.matchCount) >= 5 ? 1 : 0.7;
  const consistencyScore = (
    (100 - Math.abs(homeStats.over15Rate - awayStats.over15Rate)) / 100
  );
  const goalLineAlignment = Math.abs(combinedExpectedGoals - goalLine) < 0.5 ? 1 : 0.8;
  
  const confidenceScore = (
    (over15Probability / 100) * 0.4 +
    dataQuality * 0.3 +
    consistencyScore * 0.2 +
    goalLineAlignment * 0.1
  ) * 100;

  return {
    homeTeam,
    awayTeam,
    combinedExpectedGoals: Math.round(combinedExpectedGoals * 100) / 100,
    over15Probability: Math.round(over15Probability * 100) / 100,
    over25Probability: Math.round(over25Probability * 100) / 100,
    decision,
    confidenceScore: Math.round(confidenceScore * 100) / 100,
  };
}
