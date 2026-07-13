"use client";

import { useCallback, useState } from "react";

import LandingPage from "@/components/LandingPage";
import UploadStudio from "@/components/UploadStudio";
import ResultsDashboard from "@/components/ResultsDashboard";
import { generateTryOn, type TryOnResult } from "@/lib/api";

/**
 * The screens are plain presentational components. This page is the
 * state machine that moves between them and owns the async try-on call,
 * so the request lives in exactly one place and the screens stay dumb.
 *
 * Flow: landing → upload (including generation) → results (→ back to upload)
 */
type Stage = "landing" | "upload" | "results";

interface UploadedImage {
  url: string; // object URL for preview
  name: string;
  file: File; // raw file, sent to the backend
}

interface Selection {
  userImage: UploadedImage;
  garmentImage: UploadedImage;
  garmentType: string;
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
        description: next.garmentType,
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
    setStage("upload");
  }, []);

  switch (stage) {
    case "upload":
      return <UploadStudio onGenerate={handleGenerate} error={error ?? undefined} />;

    case "results":
      return (
        <ResultsDashboard
          personImageUrl={selection?.userImage.url}
          garmentImageUrl={selection?.garmentImage.url}
          garmentType={selection?.garmentType}
          generatedImageUrl={result?.imageUrl}
          onTryAnother={handleTryAnother}
        />
      );

    case "landing":
    default:
      return <LandingPage onCheckFit={() => setStage("upload")} />;
  }
}
