export interface ParsedResult {
  time: string;
  homeTeam: string;
  awayTeam: string;
  homeGoals: number;
  awayGoals: number;
  totalGoals: number;
  over15: boolean;
  over25: boolean;
}

export interface ParsedOdd {
  time: string;
  homeTeam: string;
  awayTeam: string;
  odd1: number;
  oddX: number;
  odd2: number;
  goalLine: number;
  overOdd: number;
  underOdd: number;
}

/**
 * Parse historical results input
 * Format: Time,Result
 * Example: 08:24,LEV 0-2 HSV
 */
export function parseResults(input: string): ParsedResult[] {
  const lines = input.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const results: ParsedResult[] = [];

  for (const line of lines) {
    // Skip header line
    if (line.toLowerCase().includes('time') && line.toLowerCase().includes('result')) {
      continue;
    }

    try {
      const parts = line.split(',');
      if (parts.length < 2) continue;

      const time = parts[0].trim();
      const matchString = parts.slice(1).join(',').trim();

      // Extract score using regex
      const scoreMatch = matchString.match(/(\d+)-(\d+)/);
      if (!scoreMatch) continue;

      const homeGoals = parseInt(scoreMatch[1], 10);
      const awayGoals = parseInt(scoreMatch[2], 10);

      // Extract team names
      const beforeScore = matchString.substring(0, matchString.indexOf(scoreMatch[0])).trim();
      const afterScore = matchString.substring(matchString.indexOf(scoreMatch[0]) + scoreMatch[0].length).trim();

      const homeTeam = beforeScore;
      const awayTeam = afterScore;

      if (!homeTeam || !awayTeam) continue;

      const totalGoals = homeGoals + awayGoals;
      const over15 = totalGoals >= 2;
      const over25 = totalGoals >= 3;

      results.push({
        time,
        homeTeam,
        awayTeam,
        homeGoals,
        awayGoals,
        totalGoals,
        over15,
        over25,
      });
    } catch (error) {
      // Skip malformed lines and continue
      console.error('Error parsing result line:', line, error);
      continue;
    }
  }

  return results;
}

/**
 * Parse upcoming odds input
 * Format: Time,Event,1,X,2,Goals,Over,Under
 * Example: 05:36,FCA - HDH,2.51,3.46,2.93,2.5,2.32,1.64
 */
export function parseOdds(input: string): ParsedOdd[] {
  const lines = input.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const odds: ParsedOdd[] = [];

  for (const line of lines) {
    // Skip header line
    if (line.toLowerCase().includes('time') && line.toLowerCase().includes('event')) {
      continue;
    }

    try {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length < 8) continue;

      const time = parts[0];
      const event = parts[1];

      // Parse teams from event (format: "FCA - HDH")
      const teamParts = event.split('-').map(t => t.trim());
      if (teamParts.length < 2) continue;

      const homeTeam = teamParts[0];
      const awayTeam = teamParts[1];

      // Parse numeric values
      const odd1 = parseFloat(parts[2]);
      const oddX = parseFloat(parts[3]);
      const odd2 = parseFloat(parts[4]);
      const goalLine = parseFloat(parts[5]);
      const overOdd = parseFloat(parts[6]);
      const underOdd = parseFloat(parts[7]);

      // Validate all numeric values
      if (isNaN(odd1) || isNaN(oddX) || isNaN(odd2) || isNaN(goalLine) || isNaN(overOdd) || isNaN(underOdd)) {
        continue;
      }

      odds.push({
        time,
        homeTeam,
        awayTeam,
        odd1,
        oddX,
        odd2,
        goalLine,
        overOdd,
        underOdd,
      });
    } catch (error) {
      // Skip malformed lines and continue
      console.error('Error parsing odd line:', line, error);
      continue;
    }
  }

  return odds;
}
