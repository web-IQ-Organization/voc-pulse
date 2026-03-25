// deliverables/voc_pulse/app/src/app/api/analyze/route.ts

import { analyzeReviews, SignalCheckReport } from '@/lib/analyzer';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reviews: string[] = body.reviews;

    if (!reviews || !Array.isArray(reviews)) {
      return NextResponse.json({ error: 'Invalid input: reviews array is required.' }, { status: 400 });
    }

    if (reviews.length === 0 || reviews.length > 50) {
      return NextResponse.json({ error: 'Invalid input: 1 to 50 reviews are required.' }, { status: 400 });
    }

    for (const review of reviews) {
      if (typeof review !== 'string' || review.length === 0 || review.length > 2000) {
        return NextResponse.json({ error: 'Invalid input: each review must be a string between 1 and 2000 characters.' }, { status: 400 });
      }
    }

    const report: SignalCheckReport = analyzeReviews(reviews);
    return NextResponse.json(report, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error occurred during analysis.' }, { status: 500 });
  }
}
