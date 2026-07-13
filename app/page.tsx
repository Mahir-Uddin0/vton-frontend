"use client";

import { useCallback, useState } from "react";

import LandingPage from "@/components/LandingPage";
import ResultsDashboard from "@/components/ResultsDashboard";
import { generateTryOn, type TryOnResult } from "@/lib/api";

/**
 * The screens are plain presentational components. This page is the
 * state machine that moves between them and owns the async try-on call,
 * so the request lives in exactly one place and the screens stay dumb.
 *
 * Flow: landing (including upload and generation) → results → landing
 */
type Stage = "landing" | "results";

interface UploadedImage {
  url: string; // object URL for preview
  name: string;
  file: File; // raw file, sent to the backend
}

interface Selection {
  userImage: UploadedImage;
  garmentImage: UploadedImage;
  description: string;
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("landing");
  const [selection, setSelection] = useState<Selection | null>(null);
  const [result, setResult] = useState<TryOnResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // The request is awaited here so the Upload Studio remains mounted while its
  // loading state is visible. The backend calls this value "description".
  const handleGenerate = useCallback(async (next: Selection) => {
    setSelection(next);
    setResult(null);
    setError(null);

    try {
      const tryOn = await generateTryOn({
        userImage: next.userImage.file,
        garmentImage: next.garmentImage.file,
        description: next.description,
      });
      setResult(tryOn);
      setStage("results");
    } catch (err) {
      console.error("Try-on generation failed:", err);
      setError(err instanceof Error ? err.message : "Unable to generate your try-on image.");
      throw err;
    }
  }, []);

  const handleTryAnother = useCallback(() => {
    setResult(null);
    setError(null);
    setStage("landing");
  }, []);

  switch (stage) {
    case "results":
      return (
        <ResultsDashboard
          personImageUrl={selection?.userImage.url}
          garmentImageUrl={selection?.garmentImage.url}
          garmentDescription={selection?.description}
          generatedImageUrl={result?.imageUrl}
          onTryAnother={handleTryAnother}
        />
      );

    case "landing":
    default:
      return <LandingPage onGenerate={handleGenerate} error={error ?? undefined} />;
  }
}
