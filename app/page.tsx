"use client";

import { useCallback, useState } from "react";

import LandingPage from "@/components/LandingPage";
import UploadStudio from "@/components/UploadStudio";
import ProcessingState from "@/components/ProcessingState";
import ResultsDashboard from "@/components/ResultsDashboard";
import { generateTryOn, type TryOnResult } from "@/lib/api";

/**
 * The four screens are plain presentational components. This page is the
 * state machine that moves between them and owns the async try-on call,
 * so the request lives in exactly one place and the screens stay dumb.
 *
 * Flow: landing → upload → processing → results (→ back to upload)
 */
type Stage = "landing" | "upload" | "processing" | "results";

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

  // Upload Studio hands us the two photos + garment type. We just advance the
  // machine; ProcessingState performs the actual request via the thunk below.
  const handleGenerate = useCallback((next: Selection) => {
    setSelection(next);
    setResult(null);
    setError(null);
    setStage("processing");
  }, []);

  const handleComplete = useCallback((tryOn: TryOnResult) => {
    setResult(tryOn);
    setStage("results");
  }, []);

  const handleProcessingError = useCallback((err: unknown) => {
    console.error("Try-on generation failed:", err);
    setError(err instanceof Error ? err.message : "Unable to generate your try-on image.");
    setStage("upload");
  }, []);

  const handleTryAnother = useCallback(() => {
    setResult(null);
    setError(null);
    setStage("upload");
  }, []);

  switch (stage) {
    case "upload":
      return <UploadStudio onGenerate={handleGenerate} error={error ?? undefined} />;

    case "processing":
      return (
        <ProcessingState
          photoUrl={selection?.userImage.url}
          request={() =>
            generateTryOn({
              userImage: selection!.userImage.file,
              garmentImage: selection!.garmentImage.file,
              description: selection!.description,
            })
          }
          onComplete={handleComplete}
          onError={handleProcessingError}
        />
      );

    case "results":
      return (
        <ResultsDashboard
          generatedImageUrl={result?.imageUrl}
          onTryAnother={handleTryAnother}
        />
      );

    case "landing":
    default:
      return <LandingPage onCheckFit={() => setStage("upload")} />;
  }
}
