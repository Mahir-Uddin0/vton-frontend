"use client";

import React, { useCallback, useRef, useState } from "react";
import {
  Camera,
  Upload,
  X,
  RotateCcw,
  Check,
  ArrowRight,
  ImageOff,
  Loader2,
} from "lucide-react";

import { Input } from "@/components/ui/input";

/**
 * UPLOAD STUDIO
 * -------------
 * Step 01 — Subject:  drag/drop or camera-capture a full body photo.
 * Step 02 — Garment:  drag/drop a garment photo + name the garment type.
 * Generate is disabled until both images and the garment type are set.
 *
 * Swap `onGenerate` for a real handler when wiring the next screen; the
 * controller passes { userImage, garmentImage, garmentType } straight to the
 * API layer.
 */

// Small viewfinder-style corner bracket, reused on every dropzone/thumbnail.
function CornerBrackets({ active }) {
  const base = "absolute w-5 h-5 border-current transition-colors duration-300";
  const color = active ? "text-[#1B4DFF]" : "text-[#C9C8C0]";
  return (
    <>
      <span className={`${base} ${color} top-3 left-3 border-t-2 border-l-2`} />
      <span className={`${base} ${color} top-3 right-3 border-t-2 border-r-2`} />
      <span className={`${base} ${color} bottom-3 left-3 border-b-2 border-l-2`} />
      <span className={`${base} ${color} bottom-3 right-3 border-b-2 border-r-2`} />
    </>
  );
}

function StepLabel({ index, title, done }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span
        className={`font-serif text-sm tabular-nums ${
          done ? "text-[#1B4DFF]" : "text-[#83837C]"
        }`}
      >
        {index}
      </span>
      <span className="h-px w-6 bg-[#DEDDD6]" />
      <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-[#0B0B0C]">
        {title}
      </span>
      {done && <Check className="w-3.5 h-3.5 text-[#1B4DFF] ml-0.5" strokeWidth={2.5} />}
    </div>
  );
}

/**
 * A single self-contained image dropzone: drag/drop, choose-file, camera
 * capture, preview with retake/remove. Used identically for both the user
 * photo and the garment photo.
 *
 *   value    — { url, name, file } | null
 *   onFile   — (file: File) => void
 *   onRemove — () => void
 */
function ImageDropzone({ value, onFile, onRemove, hint, previewAlt, removeLabel }) {
  const [isDragging, setIsDragging] = useState(false);
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFiles = useCallback(
    (files) => {
      const file = files?.[0];
      if (!file || !file.type.startsWith("image/")) return;
      setImgError(false);
      onFile(file);
    },
    [onFile]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  if (!value) {
    return (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`relative aspect-[3/4] max-w-sm rounded-sm border transition-colors duration-200 flex flex-col items-center justify-center gap-4 px-6 text-center ${
          isDragging
            ? "border-[#1B4DFF] bg-[#E8EDFF]"
            : "border-dashed border-[#C9C8C0] bg-white"
        }`}
      >
        <CornerBrackets active={isDragging} />

        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center border transition-colors ${
            isDragging
              ? "border-[#1B4DFF] text-[#1B4DFF]"
              : "border-[#C9C8C0] text-[#83837C]"
          }`}
        >
          <Upload className="w-4 h-4" strokeWidth={1.75} />
        </div>

        <div>
          <p className="text-sm font-medium">Drag a photo here, or choose below</p>
          <p className="text-xs text-[#83837C] mt-1">{hint}</p>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-medium tracking-wide px-4 py-2 rounded-sm bg-[#0B0B0C] text-white hover:bg-[#1B4DFF] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4DFF] focus-visible:ring-offset-2"
          >
            Choose file
          </button>
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="text-xs font-medium tracking-wide px-4 py-2 rounded-sm border border-[#0B0B0C] hover:border-[#1B4DFF] hover:text-[#1B4DFF] transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4DFF] focus-visible:ring-offset-2"
          >
            <Camera className="w-3.5 h-3.5" strokeWidth={1.75} />
            Camera
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-[3/4] max-w-sm rounded-sm overflow-hidden bg-[#EDECE6] fade-up">
      <CornerBrackets active />
      {!imgError ? (
        <img
          src={value.url}
          alt={previewAlt}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#83837C]">
          <ImageOff className="w-6 h-6" strokeWidth={1.5} />
          <span className="text-xs">Couldn&apos;t preview this file</span>
        </div>
      )}

      {/* Ruler ticks along the right edge — measurement motif */}
      <div className="absolute top-3 bottom-3 right-3 w-3 flex flex-col justify-between pointer-events-none">
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className={`bg-white/70 ${i % 2 === 0 ? "w-3 h-px" : "w-1.5 h-px"}`}
          />
        ))}
      </div>

      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex items-center justify-between">
        <span className="text-[11px] text-white/90 truncate max-w-[60%]">
          {value.name}
        </span>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded-sm bg-white/15 hover:bg-white/25 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Replace photo"
          >
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 rounded-sm bg-white/15 hover:bg-white/25 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label={removeLabel}
          >
            <X className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}

export default function UploadStudio({ onGenerate = (_selection) => {} }) {
  const [userImage, setUserImage] = useState(null); // { url, name, file }
  const [garmentImage, setGarmentImage] = useState(null); // { url, name, file }
  const [garmentType, setGarmentType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep the raw File — the API layer needs it to POST to the backend.
  const makeImage = (file) => ({
    url: URL.createObjectURL(file),
    name: file.name,
    file,
  });

  const setUser = useCallback((file) => setUserImage(makeImage(file)), []);
  const setGarment = useCallback((file) => setGarmentImage(makeImage(file)), []);

  const removeUser = useCallback(() => {
    setUserImage((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });
  }, []);
  const removeGarment = useCallback(() => {
    setGarmentImage((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });
  }, []);

  const canGenerate =
    Boolean(userImage) && Boolean(garmentImage) && garmentType.trim().length > 0;

  // onGenerate may be async (the controller kicks off the fit-check request).
  // We await it so the button can show a real "starting" state and we never
  // fire twice. The controller unmounts this screen on success, so we only
  // reset the flag if it rejects.
  const handleSubmit = useCallback(async () => {
    if (!canGenerate || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onGenerate({
        userImage,
        garmentImage,
        garmentType: garmentType.trim(),
      });
    } catch (err) {
      console.error("Failed to start fit check:", err);
      setIsSubmitting(false);
    }
  }, [canGenerate, isSubmitting, onGenerate, userImage, garmentImage, garmentType]);

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#0B0B0C]">
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.35s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .fade-up { animation: none; }
        }
      `}</style>

      {/* Header */}
      <header className="border-b border-[#DEDDD6] px-5 sm:px-8 py-5 flex items-center justify-between">
        <span className="font-serif text-lg tracking-tight">Fit Check</span>
        <span className="text-[11px] tracking-[0.18em] uppercase text-[#83837C]">
          Upload Studio
        </span>
      </header>

      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14 pb-32 lg:pb-14">
        <div className="mb-10 sm:mb-14">
          <h1 className="font-serif text-3xl sm:text-4xl leading-tight">
            Set your subject, upload your garment.
          </h1>
          <p className="text-[#83837C] text-sm mt-2 max-w-md">
            One full-body photo, one garment photo, and what it is. We&apos;ll map
            the rest.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14">
          {/* STEP 01 — SUBJECT */}
          <section>
            <StepLabel index="01" title="Subject" done={Boolean(userImage)} />
            <ImageDropzone
              value={userImage}
              onFile={setUser}
              onRemove={removeUser}
              hint="Full body, plain background, arms visible · JPG or PNG"
              previewAlt="Uploaded subject"
              removeLabel="Remove subject photo"
            />
          </section>

          {/* STEP 02 — GARMENT */}
          <section>
            <StepLabel
              index="02"
              title="Garment"
              done={Boolean(garmentImage) && garmentType.trim().length > 0}
            />

            <ImageDropzone
              value={garmentImage}
              onFile={setGarment}
              onRemove={removeGarment}
              hint="The item alone, flat or on a hanger · JPG or PNG"
              previewAlt="Uploaded garment"
              removeLabel="Remove garment photo"
            />

            {/* Garment type — free text */}
            <div className="max-w-sm mt-5">
              <label
                htmlFor="garment-type"
                className="block text-[11px] font-medium tracking-[0.18em] uppercase text-[#0B0B0C] mb-2"
              >
                Garment Type
              </label>
              <Input
                id="garment-type"
                value={garmentType}
                onChange={(e) => setGarmentType(e.target.value)}
                placeholder="e.g. T-shirt, Jeans, Dress"
                autoComplete="off"
                className="border-[#DEDDD6] bg-white text-[#0B0B0C] placeholder:text-[#A8A79F] rounded-sm h-10 focus-visible:border-[#1B4DFF] focus-visible:ring-[#1B4DFF]/30"
              />
            </div>
          </section>
        </div>
      </main>

      {/* Generate bar — sticky on mobile, inline on desktop */}
      <div className="fixed lg:static bottom-0 inset-x-0 border-t border-[#DEDDD6] bg-[#FAFAF7]/95 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none lg:border-t-0">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-4 lg:pt-0 lg:pb-14 flex items-center justify-between gap-4">
          <p className="text-xs text-[#83837C] hidden sm:block">
            {isSubmitting
              ? "Sending to the fit engine…"
              : canGenerate
                ? "Ready — this takes about 15 seconds."
                : "Add both photos and a garment type to continue."}
          </p>
          <button
            type="button"
            disabled={!canGenerate || isSubmitting}
            onClick={handleSubmit}
            className={`w-full sm:w-auto ml-auto flex items-center justify-center gap-2 text-sm font-medium tracking-wide px-6 py-3.5 sm:py-3 rounded-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4DFF] focus-visible:ring-offset-2 ${
              canGenerate && !isSubmitting
                ? "bg-[#1B4DFF] text-white hover:bg-[#173fd1]"
                : "bg-[#E7E6E0] text-[#A8A79F] cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <>
                Starting
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
              </>
            ) : (
              <>
                Generate Fit
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
