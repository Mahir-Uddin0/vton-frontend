"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Camera, Check, ImageOff, Loader2, RotateCcw, Upload, X } from "lucide-react";

import { Input } from "@/components/ui/input";

function makeImage(file) {
  return { url: URL.createObjectURL(file), name: file.name, file };
}

function CornerBrackets({ active }) {
  const base = "absolute h-5 w-5 border-current transition-colors duration-300";
  const color = active ? "text-[#1B4DFF]" : "text-[#C9C8C0]";

  return (
    <>
      <span className={`${base} ${color} left-3 top-3 border-l-2 border-t-2`} />
      <span className={`${base} ${color} right-3 top-3 border-r-2 border-t-2`} />
      <span className={`${base} ${color} bottom-3 left-3 border-b-2 border-l-2`} />
      <span className={`${base} ${color} bottom-3 right-3 border-b-2 border-r-2`} />
    </>
  );
}

function FieldLabel({ index, title, complete }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className={`font-serif text-sm tabular-nums ${complete ? "text-[#1B4DFF]" : "text-[#83837C]"}`}>
        {index}
      </span>
      <span className="h-px w-6 bg-[#DEDDD6]" />
      <span className="text-[11px] font-medium tracking-[0.18em] uppercase">{title}</span>
      {complete && <Check className="ml-0.5 h-3.5 w-3.5 text-[#1B4DFF]" strokeWidth={2.5} />}
    </div>
  );
}

function CameraCaptureDialog({ facingMode, onCapture, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState("");

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Camera access is not available in this browser. Use a secure HTTPS connection or localhost.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facingMode } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (cause) {
        console.error("Unable to open camera:", cause);
        setError("We couldn't open your camera. Check your browser permission, then try again.");
      }
    }

    startCamera();
    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [facingMode, stopCamera]);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      onCapture(new File([blob], `camera-${Date.now()}.jpg`, { type: "image/jpeg" }));
      stopCamera();
      onClose();
    }, "image/jpeg", 0.92);
  }, [onCapture, onClose, stopCamera]);

  return (
    <div role="dialog" aria-modal="true" aria-label="Camera capture" className="fixed inset-0 z-[60] flex items-center justify-center bg-black/65 p-5">
      <div className="w-full max-w-xl overflow-hidden rounded-sm bg-[#FAFAF7] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#DEDDD6] px-5 py-4">
          <div>
            <p className="font-serif text-xl">Take a photo</p>
            <p className="mt-0.5 text-xs text-[#83837C]">Allow camera access when your browser asks.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-sm p-2 text-[#83837C] transition-colors hover:bg-[#EDECE6] hover:text-[#0B0B0C]" aria-label="Close camera">
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="relative aspect-[4/3] bg-[#0B0B0C]">
          {error ? (
            <div className="flex h-full items-center justify-center px-8 text-center text-sm leading-relaxed text-white/80">{error}</div>
          ) : (
            <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
          )}
        </div>

        <div className="flex justify-end gap-3 p-5">
          <button type="button" onClick={onClose} className="rounded-sm border border-[#0B0B0C] px-4 py-2.5 text-sm font-medium transition-colors hover:border-[#1B4DFF] hover:text-[#1B4DFF]">
            Cancel
          </button>
          <button type="button" disabled={Boolean(error)} onClick={capturePhoto} className="flex items-center gap-2 rounded-sm bg-[#1B4DFF] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#173fd1] disabled:cursor-not-allowed disabled:bg-[#A8A79F]">
            <Camera className="h-4 w-4" strokeWidth={1.75} />
            Capture photo
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageDropzone({ value, onFile, onRemove, hint, previewAlt, removeLabel, cameraFacingMode }) {
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef(null);

  const selectFile = useCallback(
    (files) => {
      const file = files instanceof File ? files : files?.[0];
      if (!file || !file.type.startsWith("image/")) return;
      setImageError(false);
      onFile(file);
    },
    [onFile]
  );

  if (!value) {
    return (
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          selectFile(event.dataTransfer.files);
        }}
        className={`relative flex aspect-[4/5] w-full flex-col items-center justify-center gap-4 rounded-sm border px-6 text-center transition-colors ${
          isDragging ? "border-[#1B4DFF] bg-[#E8EDFF]" : "border-dashed border-[#C9C8C0] bg-white"
        }`}
      >
        <CornerBrackets active={isDragging} />
        <span className={`flex h-11 w-11 items-center justify-center rounded-full border ${isDragging ? "border-[#1B4DFF] text-[#1B4DFF]" : "border-[#C9C8C0] text-[#83837C]"}`}>
          <Upload className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <div>
          <p className="text-sm font-medium">Drop an image here</p>
          <p className="mt-1 text-xs leading-relaxed text-[#83837C]">{hint}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-sm bg-[#0B0B0C] px-4 py-2 text-xs font-medium tracking-wide text-white transition-colors hover:bg-[#1B4DFF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4DFF] focus-visible:ring-offset-2"
          >
            Choose file
          </button>
          <button
            type="button"
            onClick={() => setIsCameraOpen(true)}
            className="flex items-center gap-1.5 rounded-sm border border-[#0B0B0C] px-4 py-2 text-xs font-medium tracking-wide transition-colors hover:border-[#1B4DFF] hover:text-[#1B4DFF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4DFF] focus-visible:ring-offset-2"
          >
            <Camera className="h-3.5 w-3.5" strokeWidth={1.75} />
            Camera
          </button>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => selectFile(event.target.files)} />
        {isCameraOpen && <CameraCaptureDialog facingMode={cameraFacingMode} onCapture={selectFile} onClose={() => setIsCameraOpen(false)} />}
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-[#EDECE6]">
      <CornerBrackets active />
      {!imageError ? (
        <img src={value.url} alt={previewAlt} onError={() => setImageError(true)} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#83837C]">
          <ImageOff className="h-6 w-6" strokeWidth={1.5} />
          <span className="text-xs">Couldn&apos;t preview this file</span>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-3">
        <span className="max-w-[60%] truncate text-[11px] text-white/90">{value.name}</span>
        <div className="flex gap-1.5">
          <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-sm bg-white/15 p-1.5 text-white transition-colors hover:bg-white/25" aria-label="Replace photo">
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
          <button type="button" onClick={onRemove} className="rounded-sm bg-white/15 p-1.5 text-white transition-colors hover:bg-white/25" aria-label={removeLabel}>
            <X className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => selectFile(event.target.files)} />
    </div>
  );
}

/** Embedded upload form used directly on the landing page. */
export default function UploadStudio({
  onGenerate = (selection) => {
    void selection;
  },
  error = "",
}) {
  const [userImage, setUserImage] = useState(null);
  const [garmentImage, setGarmentImage] = useState(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setUser = useCallback((file) => {
    setUserImage((previous) => {
      if (previous?.url) URL.revokeObjectURL(previous.url);
      return makeImage(file);
    });
  }, []);
  const setGarment = useCallback((file) => {
    setGarmentImage((previous) => {
      if (previous?.url) URL.revokeObjectURL(previous.url);
      return makeImage(file);
    });
  }, []);
  const removeImage = (setter) => () => {
    setter((previous) => {
      if (previous?.url) URL.revokeObjectURL(previous.url);
      return null;
    });
  };

  const canGenerate = Boolean(userImage) && Boolean(garmentImage) && description.trim().length > 0;

  const handleSubmit = useCallback(async () => {
    if (!canGenerate || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onGenerate({ userImage, garmentImage, description: description.trim() });
    } catch (cause) {
      console.error("Try-on generation failed:", cause);
      setIsSubmitting(false);
    }
  }, [canGenerate, description, garmentImage, isSubmitting, onGenerate, userImage]);

  return (
    <section id="try-on" className="border-y border-[#DEDDD6] bg-white">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-[#1B4DFF]">Create a try-on</p>
            <h2 className="mt-2 font-serif text-3xl leading-tight sm:text-4xl">Add your images</h2>
          </div>
          </div>

        {error && <p role="alert" className="mb-6 rounded-sm border border-[#F4C7C3] bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318]">{error}</p>}

        <div className="grid grid-cols-2 gap-4 sm:gap-10">
          <section>
            <FieldLabel index="01" title="Person image" complete={Boolean(userImage)} />
            <ImageDropzone value={userImage} onFile={setUser} onRemove={removeImage(setUserImage)} hint="Full body, plain background, arms visible · JPG or PNG" previewAlt="Uploaded person" removeLabel="Remove person image" cameraFacingMode="user" />
          </section>

          <section>
            <FieldLabel index="02" title="Garment" complete={Boolean(garmentImage) && description.trim().length > 0} />
            <ImageDropzone value={garmentImage} onFile={setGarment} onRemove={removeImage(setGarmentImage)} hint="Item alone, flat or on a hanger · JPG or PNG" previewAlt="Uploaded garment" removeLabel="Remove garment image" cameraFacingMode="environment" />
            <div className="mt-5">
              <label htmlFor="garment-description" className="mb-2 block text-[11px] font-medium tracking-[0.18em] uppercase">Garment description</label>
              <Input id="garment-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="e.g. Blue denim jacket with silver buttons" autoComplete="off" className="h-11 rounded-sm border-[#DEDDD6] bg-white placeholder:text-[#A8A79F] focus-visible:border-[#1B4DFF] focus-visible:ring-[#1B4DFF]/30" />
            </div>
          </section>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-[#DEDDD6] pt-5 text-center">
          <p className="text-xs text-[#83837C]">{canGenerate ? "Ready to create your virtual try-on." : "Add both images and a garment description to continue."}</p>
          <button type="button" disabled={!canGenerate || isSubmitting} onClick={handleSubmit} className={`flex w-full items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm font-medium tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4DFF] focus-visible:ring-offset-2 sm:w-auto ${canGenerate && !isSubmitting ? "bg-[#1B4DFF] text-white hover:bg-[#173fd1]" : "cursor-not-allowed bg-[#E7E6E0] text-[#A8A79F]"}`}>
            Generate Try-On
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {isSubmitting && (
        <div role="status" aria-live="polite" className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAFAF7]/75 px-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-sm border border-[#DEDDD6] bg-white p-7 shadow-xl shadow-black/5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8EDFF] text-[#1B4DFF]"><Loader2 className="h-5 w-5 animate-spin" strokeWidth={2} /></span>
              <div>
                <p className="font-serif text-xl">Creating your virtual try-on</p>
                <p className="mt-0.5 text-sm text-[#83837C]">Your images are being prepared by the try-on model.</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[10px] font-medium tracking-[0.12em] uppercase text-[#83837C]">
              <span className="rounded-sm bg-[#F0EFE9] px-2 py-2">Images ready</span>
              <span className="rounded-sm bg-[#E8EDFF] px-2 py-2 text-[#1B4DFF]">Generating</span>
              <span className="rounded-sm bg-[#F0EFE9] px-2 py-2">Result next</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
