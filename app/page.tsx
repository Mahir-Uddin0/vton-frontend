"use client";

import { useCallback, useState } from "react";

import LandingPage from "@/components/LandingPage";
import UploadStudio from "@/components/UploadStudio";
import ProcessingState from "@/components/ProcessingState";
import ResultsDashboard from "@/components/ResultsDashboard";
import { checkFit, type FitResult } from "@/lib/api";

/**
 * The four screens are plain presentational components. This page is the
 * state machine that moves between them and owns the async fit-check call,
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
  garmentType: string;
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("landing");
  const [selection, setSelection] = useState<Selection | null>(null);
  const [result, setResult] = useState<FitResult | null>(null);

  // Upload Studio hands us the two photos + garment type. We just advance the
  // machine; ProcessingState performs the actual request via the thunk below.
  const handleGenerate = useCallback((next: Selection) => {
    setSelection(next);
    setResult(null);
    setStage("processing");
  }, []);

  const handleComplete = useCallback((fit: FitResult) => {
    setResult(fit);
    setStage("results");
  }, []);

  const handleProcessingError = useCallback((err: unknown) => {
    console.error("Fit check failed:", err);
    // Simple recovery for the demo: return to the studio so the user retries.
    // A real app would surface a toast / inline error here.
    setStage("upload");
  }, []);

  const handleTryAnother = useCallback(() => {
    setResult(null);
    setStage("upload");
  }, []);

  switch (stage) {
    case "upload":
      return <UploadStudio onGenerate={handleGenerate} />;

    case "processing":
      return (
        <ProcessingState
          photoUrl={selection?.userImage.url}
          request={() =>
            checkFit(
              {
                userImage: selection!.userImage.file,
                garmentImage: selection!.garmentImage.file,
                garmentType: selection!.garmentType,
              },
              selection!.userImage.url
            )
          }
          onComplete={handleComplete}
          onError={handleProcessingError}
        />
      );

    case "results":
      return (
        <ResultsDashboard
          originalPhotoUrl={selection?.userImage.url}
          result={result ?? undefined}
          onTryAnother={handleTryAnother}
        />
      );

    case "landing":
    default:
      return <LandingPage onCheckFit={() => setStage("upload")} />;
  }
}
