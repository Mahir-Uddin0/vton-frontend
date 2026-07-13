"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Check, AlertTriangle, RefreshCcw, Share2, BookmarkPlus, Shirt } from "lucide-react";

/**
 * RESULTS DASHBOARD
 * -----------------
 * Original photo vs. mock "fitted" photo side by side, an animated
 * radial fit-score gauge, plain-language insights, and the follow-up
 * actions. All data below is mocked — replace `MOCK_RESULT` with the
 * real inference response when wiring up the backend.
 */

const MOCK_RESULT = {
  score: 92,
  size: "M",
  garmentName: "Bomber Jacket",
  insights: [
    { text: "Shoulders sit right at the seam — a clean, tailored line.", type: "good" },
    { text: "Sleeves may run slightly long past the wrist bone.", type: "caution" },
    { text: "Chest and torso have comfortable ease, not tight.", type: "good" },
    { text: "Hem falls just below the hip, as designed.", type: "good" },
  ],
};

function Gauge({ score }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = useMotionValue(0);
  const dashOffset = useTransform(progress, (v) => circumference - (v / 100) * circumference);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const controls = animate(progress, score, {
      duration: 1.1,
      ease: "easeOut",
      delay: 0.2,
      onUpdate: (v) => setDisplayScore(Math.round(v)),
    });
    return () => controls.stop();
  }, [score, progress]);

  return (
    <div className="relative w-44 h-44 shrink-0">
      <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#E7E6E0" strokeWidth="10" />
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#1B4DFF"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-4xl tabular-nums">{displayScore}%</span>
        <span className="text-[10px] tracking-[0.15em] uppercase text-[#83837C] mt-1">
          Match
        </span>
      </div>
    </div>
  );
}

function InsightRow({ text, type, index }) {
  const isGood = type === "good";
  return (
    <motion.li
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.5 + index * 0.08 }}
      className="flex items-start gap-3 py-3 border-b border-[#DEDDD6] last:border-b-0"
    >
      <span
        className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
          isGood ? "bg-[#E8EDFF] text-[#1B4DFF]" : "bg-[#F0EFE9] text-[#0B0B0C]"
        }`}
      >
        {isGood ? (
          <Check className="w-3 h-3" strokeWidth={3} />
        ) : (
          <AlertTriangle className="w-3 h-3" strokeWidth={2.25} />
        )}
      </span>
      <p className="text-sm leading-snug text-[#0B0B0C]">{text}</p>
    </motion.li>
  );
}

export default function ResultsDashboard({
  originalPhotoUrl,
  result = MOCK_RESULT,
  onTryAnother = () => {},
  onShare = () => {},
  onSave = () => {},
}) {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#0B0B0C]">
      <header className="border-b border-[#DEDDD6] px-5 sm:px-8 py-5 flex items-center justify-between">
        <span className="font-serif text-lg tracking-tight">Fit Check</span>
        <span className="text-[11px] tracking-[0.18em] uppercase text-[#83837C]">
          Results
        </span>
      </header>

      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h1 className="font-serif text-3xl sm:text-4xl leading-tight">
            {result.score}% match for size {result.size}.
          </h1>
          <p className="text-[#83837C] text-sm mt-2">
            {result.garmentName} — here&apos;s how it sits on you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14">
          {/* Split photo comparison */}
          <section>
            <div className="grid grid-cols-2 gap-3">
              <figure>
                <div className="aspect-[3/4] rounded-sm overflow-hidden bg-[#EDECE6]">
                  {originalPhotoUrl && (
                    <img
                      src={originalPhotoUrl}
                      alt="Original photo"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <figcaption className="text-[10px] tracking-[0.15em] uppercase text-[#83837C] mt-2">
                  Original
                </figcaption>
              </figure>

              <figure>
                <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-[#EDECE6]">
                  {originalPhotoUrl && (
                    <img
                      src={originalPhotoUrl}
                      alt="Fitted result"
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* Mock garment overlay — stands in for the generated fit render */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="absolute inset-x-[15%] top-[18%] h-[42%] rounded-sm bg-[#1B4DFF]/18 border border-[#1B4DFF]/50 flex items-center justify-center backdrop-blur-[1px]"
                  >
                    <Shirt className="w-6 h-6 text-[#1B4DFF]" strokeWidth={1.5} />
                  </motion.div>
                  <span className="absolute top-2 left-2 text-[9px] tracking-[0.12em] uppercase bg-[#1B4DFF] text-white px-2 py-1 rounded-sm">
                    Mock render
                  </span>
                </div>
                <figcaption className="text-[10px] tracking-[0.15em] uppercase text-[#83837C] mt-2">
                  With {result.garmentName}
                </figcaption>
              </figure>
            </div>
          </section>

          {/* Score + insights */}
          <section>
            <div className="flex items-center gap-6 mb-8">
              <Gauge score={result.score} />
              <div>
                <p className="text-xs tracking-[0.15em] uppercase text-[#83837C] mb-1">
                  Recommended size
                </p>
                <p className="font-serif text-3xl">{result.size}</p>
              </div>
            </div>

            <p className="text-[11px] tracking-[0.18em] uppercase text-[#83837C] mb-1">
              Fit insights
            </p>
            <ul>
              {result.insights.map((insight, i) => (
                <InsightRow key={i} {...insight} index={i} />
              ))}
            </ul>
          </section>
        </div>
      </main>

      {/* Actions */}
      <div className="fixed lg:static bottom-0 inset-x-0 border-t border-[#DEDDD6] bg-[#FAFAF7]/95 backdrop-blur-sm lg:bg-transparent lg:border-t-0">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-4 lg:pb-14 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onTryAnother}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-medium tracking-wide px-5 py-3 rounded-sm border border-[#0B0B0C] hover:border-[#1B4DFF] hover:text-[#1B4DFF] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4DFF] focus-visible:ring-offset-2"
          >
            <RefreshCcw className="w-3.5 h-3.5" strokeWidth={1.75} />
            Try Another Garment
          </button>

          <button
            type="button"
            onClick={onShare}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-medium tracking-wide px-5 py-3 rounded-sm border border-[#DEDDD6] hover:border-[#0B0B0C] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4DFF] focus-visible:ring-offset-2"
          >
            <Share2 className="w-3.5 h-3.5" strokeWidth={1.75} />
            Share Fit
          </button>

          <button
            type="button"
            onClick={onSave}
            className="flex-1 sm:flex-none sm:ml-auto flex items-center justify-center gap-2 text-sm font-medium tracking-wide px-5 py-3 rounded-sm bg-[#1B4DFF] text-white hover:bg-[#173fd1] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4DFF] focus-visible:ring-offset-2"
          >
            <BookmarkPlus className="w-3.5 h-3.5" strokeWidth={1.75} />
            Save to Profile
          </button>
        </div>
      </div>
    </div>
  );
}
