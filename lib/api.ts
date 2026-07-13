/**
 * FIT CHECK API — mock service
 * ----------------------------
 * Single source of truth for the frontend↔backend contract.
 *
 * The rest of the app only ever imports `checkFit` and the exported types.
 * When the real Python computer-vision backend is ready, replace ONLY the
 * body of `checkFit` (see the commented `fetch` example) — the signature,
 * the types, and every call site stay exactly the same.
 */

export type FitInsightType = "good" | "caution";

export interface FitInsight {
  text: string;
  type: FitInsightType;
}

/** What the frontend sends to the backend. */
export interface FitCheckRequest {
  /** The user's full-body photo — ready to drop into FormData for a real POST. */
  userImage: File;
  /** The garment photo to fit onto the user. */
  garmentImage: File;
  /** Free-text garment type, e.g. "T-shirt", "Jeans", "Dress". */
  garmentType: string;
}

/** What the backend returns. Mirror this in the Python response schema. */
export interface FitResult {
  score: number; // 0–100 match score
  size: string; // recommended size, e.g. "M"
  garmentName: string;
  /** URL of the rendered/annotated image (bounding boxes, fit overlay). */
  processedImageUrl: string;
  insights: FitInsight[];
}

/** Simulated network + inference latency (ms). */
const MOCK_LATENCY = 2600;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Deterministic-ish mock so the demo feels alive without a backend.
function buildMockResult(req: FitCheckRequest, previewUrl: string): FitResult {
  const seed = req.userImage.name.length + req.garmentImage.name.length;
  const score = 84 + (seed % 13); // 84–96
  const sizes = ["S", "M", "L"];
  const size = sizes[seed % sizes.length];

  return {
    score,
    size,
    garmentName: req.garmentType,
    // In the mock we echo the user's own photo back. The real backend
    // returns its rendered/annotated image URL here instead.
    processedImageUrl: previewUrl,
    insights: [
      { text: "Shoulders sit right at the seam — a clean, tailored line.", type: "good" },
      { text: "Sleeves may run slightly long past the wrist bone.", type: "caution" },
      { text: "Chest and torso have comfortable ease, not tight.", type: "good" },
      { text: "Hem falls just below the hip, as designed.", type: "good" },
    ],
  };
}

/**
 * Run a fit check. Currently mocked; swap the body for a real request later.
 *
 * @param request  image File + selected garment
 * @param previewUrl  object URL of the uploaded photo, used as the mock
 *                    processed image so the results screen has something to
 *                    show. The real backend supplies its own URL and this
 *                    argument can be dropped.
 */
export async function checkFit(
  request: FitCheckRequest,
  previewUrl: string
): Promise<FitResult> {
  await delay(MOCK_LATENCY);

  // --- REAL BACKEND (uncomment & delete the mock below when ready) ---------
  // const form = new FormData();
  // form.append("userImage", request.userImage);
  // form.append("garmentImage", request.garmentImage);
  // form.append("garmentType", request.garmentType);
  //
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fit-check`, {
  //   method: "POST",
  //   body: form,
  // });
  // if (!res.ok) throw new Error(`Fit check failed (${res.status})`);
  // return (await res.json()) as FitResult;
  // -------------------------------------------------------------------------

  return buildMockResult(request, previewUrl);
}
