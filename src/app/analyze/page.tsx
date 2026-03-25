// deliverables/voc_pulse/app/src/app/analyze/page.tsx

'use client';

import { useState } from 'react';
import type { SignalCheckReport, Sentiment } from '@/lib/analyzer';

const SentimentBadge: React.FC<{ score: number }> = ({ score }) => {
  let bgColor = 'bg-gray-700';
  let textColor = 'text-white';
  if (score >= 70) {
    bgColor = 'bg-green-500';
  } else if (score >= 40) {
    bgColor = 'bg-yellow-500';
  } else {
    bgColor = 'bg-red-500';
  }
  return <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${bgColor} ${textColor}`}>{score}/100</span>;
};

const UrgencyBadge: React.FC<{ level: 'low' | 'medium' | 'high' }> = ({ level }) => {
  let bgColor = 'bg-green-500';
  if (level === 'medium') {
    bgColor = 'bg-yellow-500';
  } else if (level === 'high') {
    bgColor = 'bg-red-500';
  }
  return <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${bgColor} text-white`}>{level.toUpperCase()}</span>;
};

const getSentimentEmoji = (sentiment: Sentiment) => {
  if (sentiment === 'positive') return '😊';
  if (sentiment === 'negative') return '😞';
  return '😐';
};

export default function AnalyzePage() {
  const [reviews, setReviews] = useState<string>('');
  const [report, setReport] = useState<SignalCheckReport | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setError(null);
    setLoading(true);
    setReport(null);

    const reviewArray = reviews.split(/\n+|,/).map(s => s.trim()).filter(s => s.length > 0);

    if (reviewArray.length === 0) {
      setError('Please enter at least one review.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviews: reviewArray }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'An unknown error occurred.');
        return;
      }

      const data: SignalCheckReport = await response.json();
      setReport(data);
    } catch (err) {
      console.error('Failed to fetch analysis:', err);
      setError('Failed to connect to the analysis service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-gray-100 flex flex-col items-center py-12 px-4">
      <h1 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Signal Check</h1>
      <p className="text-lg text-gray-300 mb-8 max-w-2xl text-center">Paste your customer reviews below (one per line or comma-separated) and get an instant Signal Check report.</p>

      <div className="w-full max-w-4xl bg-zinc-900 p-8 rounded-lg shadow-xl mb-8 border border-zinc-800">
        <textarea
          className="w-full h-64 p-4 mb-4 bg-zinc-800 text-gray-200 rounded-md border border-zinc-700 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
          placeholder="Paste reviews here. E.g.,\n- The product is great, but support is slow.\n- Love the new features, amazing UX!\n- Pricing is a bit high.\n- Bugs everywhere! Unreliable performance."
          value={reviews}
          onChange={(e) => setReviews(e.target.value)}
        ></textarea>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing...' : 'Analyze Reviews →'}
        </button>
        {error && <p className="text-red-400 mt-4 text-center">Error: {error}</p>}
      </div>

      {report && (
        <div className="w-full max-w-4xl bg-zinc-900 p-8 rounded-lg shadow-xl border border-zinc-800 mt-8 animate-fade-in">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">Signal Check Report</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-zinc-800 p-6 rounded-lg flex flex-col items-center justify-center">
              <p className="text-xl text-gray-300 mb-2">Overall Sentiment</p>
              <SentimentBadge score={report.sentimentScore} />
            </div>
            <div className="bg-zinc-800 p-6 rounded-lg flex flex-col items-center justify-center">
              <p className="text-xl text-gray-300 mb-2">Urgency Level</p>
              <UrgencyBadge level={report.urgencyLevel} />
            </div>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-3 text-white">Summary</h3>
            <p className="text-gray-300 leading-relaxed">{(report as SignalCheckReport).summary}</p>
          </div>

          {report.topThemes && report.topThemes.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-3 text-white">Top Themes</h3>
              <table className="min-w-full bg-zinc-800 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-zinc-700">
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Theme</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Count</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Sentiment</th>
                  </tr>
                </thead>
                <tbody>
                  {report.topThemes.map((theme, index) => (
                    <tr key={index} className="border-b border-zinc-700 last:border-b-0">
                      <td className="py-3 px-4 text-sm text-gray-200">{theme.theme}</td>
                      <td className="py-3 px-4 text-sm text-gray-200">{theme.count}</td>
                      <td className="py-3 px-4 text-sm">{getSentimentEmoji(theme.sentiment)} {theme.sentiment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {report.topComplaints && report.topComplaints.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-3 text-white">Top Complaints</h3>
              <ul className="list-disc list-inside text-red-400 space-y-2">
                {report.topComplaints.map((complaint, index) => (
                  <li key={index}>{complaint}</li>
                ))}
              </ul>
            </div>
          )}

          {report.topPraise && report.topPraise.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold mb-3 text-white">Top Praise</h3>
              <ul className="list-disc list-inside text-green-400 space-y-2">
                {report.topPraise.map((praise, index) => (
                  <li key={index}>{praise}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
