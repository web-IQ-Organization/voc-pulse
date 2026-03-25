// deliverables/voc_pulse/app/src/app/page.tsx

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-gray-100 flex flex-col items-center justify-center py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-600 leading-tight">
          Know What Your Customers Really Think
        </h1>
        <p className="text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
          Uncover actionable insights from your customer reviews with AI-powered sentiment analysis and theme extraction.
        </p>
        <Link href="/analyze" legacyBehavior>
          <a className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105">
            Run a Free Signal Check →
          </a>
        </Link>
      </header>

      <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16">
        <div className="bg-zinc-900 p-8 rounded-lg shadow-xl border border-zinc-800 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-3xl font-semibold text-teal-400 mb-4">Instant Sentiment Analysis</h3>
          <p className="text-gray-300 text-lg">Quickly gauge the emotional tone of thousands of reviews in seconds.</p>
        </div>
        <div className="bg-zinc-900 p-8 rounded-lg shadow-xl border border-zinc-800 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-3xl font-semibold text-cyan-400 mb-4">Theme Extraction</h3>
          <p className="text-gray-300 text-lg">Identify key topics and recurring patterns without manual digging.</p>
        </div>
        <div className="bg-zinc-900 p-8 rounded-lg shadow-xl border border-zinc-800 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-3xl font-semibold text-purple-400 mb-4">Actionable Signal Check</h3>
          <p className="text-gray-300 text-lg">Receive a clear report with top praise, complaints, and urgency levels.</p>
        </div>
      </section>

      <section className="w-full max-w-3xl text-center">
        <h2 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-600">Pricing</h2>
        <div className="bg-zinc-900 p-10 rounded-lg shadow-xl border border-zinc-800">
          <div className="mb-6">
            <h3 className="text-4xl font-bold text-gray-100 mb-2">Free Tier</h3>
            <p className="text-xl text-gray-300">Get 3 Signal Checks per month. Perfect for small businesses and quick insights.</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-gray-100 mb-2">Pro Signal Check</h3>
            <p className="text-xl text-gray-300">$750 per Signal Check. Includes a full report with deeper analysis and custom recommendations.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
