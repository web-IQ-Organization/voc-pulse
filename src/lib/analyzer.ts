// deliverables/voc_pulse/app/src/lib/analyzer.ts

export type Sentiment = 'positive' | 'negative' | 'neutral';

export interface SignalCheckReport {
  summary: string;
  sentimentScore: number; // 0-100
  topThemes: { theme: string; count: number; sentiment: Sentiment }[];
  topComplaints: string[];
  topPraise: string[];
  reviewCount: number;
  urgencyLevel: 'low' | 'medium' | 'high';
}

interface KeywordDictionary {
  [key: string]: string[]; // theme: [keywords]
}

const THEME_KEYWORDS: KeywordDictionary = {
  pricing: ['price', 'cost', 'expensive', 'affordable', 'value', 'money', 'plan', 'subscription'],
  support: ['support', 'customer service', 'help', 'responsive', 'team', 'issue', 'ticket', 'assist'],
  'ease of use': ['easy', 'simple', 'intuitive', 'complex', 'difficult', 'user friendly', 'UX', 'UI'],
  integrations: ['integrate', 'integration', 'connect', 'API', 'third-party', 'tools'],
  performance: ['slow', 'fast', 'speed', 'load', 'perform', 'glitch', 'lag'],
  reliability: ['reliable', 'stable', 'down', 'crash', 'buggy', 'uptime'],
  onboarding: ['onboard', 'setup', 'tutorial', 'learn', 'getting started'],
  features: ['feature', 'functionality', 'missing', 'lack', 'capability', 'tool'],
  bugs: ['bug', 'error', 'glitch', 'issue', 'fix', 'broken'],
  'UX/UI': ['interface', 'design', 'layout', 'confusing', 'clunky', 'modern', 'clean'],
};

const POSITIVE_WORDS = [
  'great', 'excellent', 'amazing', 'fantastic', 'good', 'love', 'helpful', 'responsive',
  'easy', 'simple', 'intuitive', 'powerful', 'robust', 'efficient', 'reliable', 'stable',
  'superb', 'wonderful', 'perfect', 'smooth', 'fast', 'quick', 'effective', 'beneficial',
  'impressed', 'satisfied', 'recommend', 'flawless', 'seamless', 'delighted', 'top-notch',
  'saves time', 'worthwhile', 'best', 'joy', 'happy', 'pleased', 'clear', 'understandable'
];

const NEGATIVE_WORDS = [
  'bad', 'poor', 'terrible', 'horrible', 'hate', 'frustrating', 'difficult', 'complex',
  'slow', 'buggy', 'unreliable', 'crash', 'expensive', 'overpriced', 'missing', 'lack',
  'confusing', 'clunky', 'unresponsive', 'annoying', 'disappointed', 'issue', 'problem',
  'flaw', 'broken', 'hard', 'struggle', 'waste', 'regret', 'awful', 'inferior', 'worst',
  'unusable', 'unstable', 'disappointed', 'misleading', 'lacking', 'tough', 'glitch'
];

export function analyzeReviews(reviews: string[]): SignalCheckReport {
  if (!reviews || reviews.length === 0) {
    return {
      summary: "No reviews provided for analysis.",
      sentimentScore: 50,
      topThemes: [],
      topComplaints: [],
      topPraise: [],
      reviewCount: 0,
      urgencyLevel: 'low',
    };
  }

  const reviewCount = reviews.length;
  let totalSentimentScore = 0;
  const themeCounts: { [key: string]: { positive: number; negative: number; neutral: number; total: number } } = {};
  const allComplaints: string[] = [];
  const allPraise: string[] = [];

  // Initialize theme counts
  for (const theme in THEME_KEYWORDS) {
    themeCounts[theme] = { positive: 0, negative: 0, neutral: 0, total: 0 };
  }

  reviews.forEach(review => {
    const lowerReview = review.toLowerCase();
    let reviewPositiveScore = 0;
    let reviewNegativeScore = 0;

    // Sentiment scoring for individual review
    POSITIVE_WORDS.forEach(word => {
      if (lowerReview.includes(word)) {
        reviewPositiveScore++;
      }
    });
    NEGATIVE_WORDS.forEach(word => {
      if (lowerReview.includes(word)) {
        reviewNegativeScore++;
      }
    });

    const netReviewSentiment = reviewPositiveScore - reviewNegativeScore;
    totalSentimentScore += netReviewSentiment;

    // Theme extraction and sentiment per theme
    for (const theme in THEME_KEYWORDS) {
      const keywords = THEME_KEYWORDS[theme];
      const themeDetected = keywords.some(keyword => lowerReview.includes(keyword));

      if (themeDetected) {
        themeCounts[theme].total++;
        if (netReviewSentiment > 0) {
          themeCounts[theme].positive++;
        } else if (netReviewSentiment < 0) {
          themeCounts[theme].negative++;
        } else {
          themeCounts[theme].neutral++;
        }
      }
    }

    // Simple complaint/praise extraction (MVP: just use positive/negative words)
    // In a more advanced version, this would involve NLP for phrases.
    if (netReviewSentiment < -1) {
      // Find prominent negative keywords or phrases
      const complaintKeywords = NEGATIVE_WORDS.filter(word => lowerReview.includes(word));
      if (complaintKeywords.length > 0) {
        allComplaints.push(`Users complain about ${complaintKeywords.join(', ').slice(0, 100)}...`);
      } else {
        allComplaints.push(review.slice(0, 100) + '...'); // Fallback
      }
    } else if (netReviewSentiment > 1) {
      // Find prominent positive keywords or phrases
      const praiseKeywords = POSITIVE_WORDS.filter(word => lowerReview.includes(word));
      if (praiseKeywords.length > 0) {
        allPraise.push(`Users praise ${praiseKeywords.join(', ').slice(0, 100)}...`);
      } else {
        allPraise.push(review.slice(0, 100) + '...'); // Fallback
      }
    }
  });

  // Calculate overall sentiment score (0-100)
  // This is a very basic linear scaling. Could be improved with a more robust model.
  const maxPossibleScore = reviews.length * Math.max(POSITIVE_WORDS.length, NEGATIVE_WORDS.length);
  const minPossibleScore = reviews.length * -Math.max(POSITIVE_WORDS.length, NEGATIVE_WORDS.length);
  const normalizedSentiment = (totalSentimentScore - minPossibleScore) / (maxPossibleScore - minPossibleScore);
  const sentimentScore = Math.round(normalizedSentiment * 100);

  // Top Themes
  const sortedThemes = Object.entries(themeCounts)
    .sort(([, a], [, b]) => b.total - a.total)
    .slice(0, 5) // Top 5 themes
    .map(([theme, counts]) => {
      let sentiment: Sentiment = 'neutral';
      if (counts.positive > counts.negative) {
        sentiment = 'positive';
      } else if (counts.negative > counts.positive) {
        sentiment = 'negative';
      }
      return { theme, count: counts.total, sentiment };
    });

  // Top Complaints & Praise (deduplicate and take top 3)
  const topComplaints = Array.from(new Set(allComplaints)).slice(0, 3);
  const topPraise = Array.from(new Set(allPraise)).slice(0, 3);

  // Determine urgency level
  let urgencyLevel: UrgencyLevel = 'low';
  const negativeReviewRatio = reviews.filter(r => {
    let reviewPositiveScore = 0;
    let reviewNegativeScore = 0;
    POSITIVE_WORDS.forEach(word => { if (r.toLowerCase().includes(word)) reviewPositiveScore++; });
    NEGATIVE_WORDS.forEach(word => { if (r.toLowerCase().includes(word)) reviewNegativeScore++; });
    return (reviewNegativeScore > reviewPositiveScore);
  }).length / reviewCount;

  if (negativeReviewRatio > 0.4 || sentimentScore < 40 && reviewCount > 5) {
    urgencyLevel = 'high';
  } else if (negativeReviewRatio > 0.2 || sentimentScore < 60 && reviewCount > 5) {
    urgencyLevel = 'medium';
  }

  // Generate summary
  let summary = `Analyzed ${reviewCount} customer reviews. The overall sentiment is ${sentimentScore >= 70 ? 'positive' : sentimentScore >= 40 ? 'neutral' : 'negative'} with a score of ${sentimentScore}/100. `;
  if (topThemes.length > 0) {
    summary += `Key areas of feedback include ${topThemes.map(t => t.theme).join(', ')}.`;
  } else {
    summary += `No prominent themes were identified.`;
  }
  if (topComplaints.length > 0) {
    summary += ` Common complaints highlight: ${topComplaints.join('; ')}.`;
  }
  if (topPraise.length > 0) {
    summary += ` Users frequently praise: ${topPraise.join('; ')}.`;
  }

  return {
    summary,
    sentimentScore,
    topThemes,
    topComplaints,
    topPraise,
    reviewCount,
    urgencyLevel,
  };
}
