'use client';

import { useState, useEffect } from 'react';

interface Prediction {
  id: string;
  homeTeam: string;
  awayTeam: string;
  time: string;
  combinedExpectedGoals: number;
  over15Probability: number;
  over25Probability: number;
  decision: string;
  confidenceScore: number;
}

export default function Home() {
  const [resultsInput, setResultsInput] = useState('');
  const [oddsInput, setOddsInput] = useState('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch predictions on mount
  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const response = await fetch('/api/predictions');
      const data = await response.json();
      if (data.success) {
        setPredictions(data.data);
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  };

  const handleResultsSubmit = async () => {
    if (!resultsInput.trim()) {
      setMessage('Please enter results data');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: resultsInput }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setResultsInput('');
      } else {
        setMessage(data.error || 'Failed to process results');
      }
    } catch (error) {
      setMessage('Error submitting results');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOddsSubmit = async () => {
    if (!oddsInput.trim()) {
      setMessage('Please enter odds data');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/odds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: oddsInput }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setOddsInput('');
        // Refresh predictions
        await fetchPredictions();
      } else {
        setMessage(data.error || 'Failed to process odds');
      }
    } catch (error) {
      setMessage('Error submitting odds');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getDecisionColor = (decision: string) => {
    if (decision === 'LOCK 2+ GOALS') return 'text-green-400';
    if (decision === 'SAFE OVER 1.5') return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Marquee Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-4 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-2xl font-bold text-white">
            ⚽ Welcome to ONIMIX EAGLE EYE Pick – Where Data Sees What Others Miss ⚽
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            ONIMIX EAGLE EYE Pick
          </h1>
          <p className="text-gray-400 text-lg">Professional Football Intelligence Dashboard</p>
        </div>

        {/* Message Display */}
        {message && (
          <div className="mb-6 p-4 bg-blue-900/30 border border-blue-500 rounded-lg text-center">
            <p className="text-blue-300">{message}</p>
          </div>
        )}

        {/* Input Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Panel A: Historical Results */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">📊 Historical Results</h2>
            <p className="text-gray-400 text-sm mb-4">
              Format: Time,Result (e.g., 08:24,LEV 0-2 HSV)
            </p>
            <textarea
              value={resultsInput}
              onChange={(e) => setResultsInput(e.target.value)}
              placeholder="Time,Result&#10;08:24,LEV 0-2 HSV&#10;08:24,MAI 4-0 SCF"
              className="w-full h-40 bg-gray-900 text-white border border-gray-600 rounded-lg p-3 font-mono text-sm focus:outline-none focus:border-blue-500"
              disabled={loading}
            />
            <button
              onClick={handleResultsSubmit}
              disabled={loading}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? 'Processing...' : 'Submit Results'}
            </button>
          </div>

          {/* Panel B: Upcoming Odds */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">🎯 Upcoming Odds</h2>
            <p className="text-gray-400 text-sm mb-4">
              Format: Time,Event,1,X,2,Goals,Over,Under
            </p>
            <textarea
              value={oddsInput}
              onChange={(e) => setOddsInput(e.target.value)}
              placeholder="Time,Event,1,X,2,Goals,Over,Under&#10;05:36,FCA - HDH,2.51,3.46,2.93,2.5,2.32,1.64"
              className="w-full h-40 bg-gray-900 text-white border border-gray-600 rounded-lg p-3 font-mono text-sm focus:outline-none focus:border-purple-500"
              disabled={loading}
            />
            <button
              onClick={handleOddsSubmit}
              disabled={loading}
              className="mt-4 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? 'Processing...' : 'Submit Odds & Analyze'}
            </button>
          </div>
        </div>

        {/* Panel C: Predictions Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-green-400 mb-6">🔮 Match Analysis & Predictions</h2>
          
          {predictions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl">No predictions yet</p>
              <p className="text-sm mt-2">Submit odds data to generate predictions</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="pb-3 px-4 text-gray-400 font-semibold">Time</th>
                    <th className="pb-3 px-4 text-gray-400 font-semibold">Match</th>
                    <th className="pb-3 px-4 text-gray-400 font-semibold text-center">Exp. Goals</th>
                    <th className="pb-3 px-4 text-gray-400 font-semibold text-center">Over 1.5%</th>
                    <th className="pb-3 px-4 text-gray-400 font-semibold text-center">Over 2.5%</th>
                    <th className="pb-3 px-4 text-gray-400 font-semibold text-center">Decision</th>
                    <th className="pb-3 px-4 text-gray-400 font-semibold text-center">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((pred) => (
                    <tr key={pred.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                      <td className="py-4 px-4 text-gray-300">{pred.time}</td>
                      <td className="py-4 px-4 font-semibold text-white">
                        {pred.homeTeam} vs {pred.awayTeam}
                      </td>
                      <td className="py-4 px-4 text-center text-blue-400 font-bold">
                        {pred.combinedExpectedGoals.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-center text-green-400 font-bold">
                        {pred.over15Probability.toFixed(1)}%
                      </td>
                      <td className="py-4 px-4 text-center text-yellow-400 font-bold">
                        {pred.over25Probability.toFixed(1)}%
                      </td>
                      <td className={`py-4 px-4 text-center font-bold ${getDecisionColor(pred.decision)}`}>
                        {pred.decision}
                      </td>
                      <td className={`py-4 px-4 text-center font-bold ${getConfidenceColor(pred.confidenceScore)}`}>
                        {pred.confidenceScore.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2024 ONIMIX EAGLE EYE Pick - Professional Football Intelligence System</p>
        </div>
      </div>
    </div>
  );
}
