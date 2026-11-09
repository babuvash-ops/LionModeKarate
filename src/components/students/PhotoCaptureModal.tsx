import React, { useState, useRef, useEffect } from "react";
import { Camera, Upload, X, Check, RefreshCw, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import GoldButton from "@/components/shared/GoldButton";
import { toast } from "sonner";

interface PhotoCaptureModalProps {
  open: boolean;
  onClose: () => void;
  onPhotoSelected: (photoUrl: string) => void;
  studentName?: string;
  currentPhoto?: string;
}

export default function PhotoCaptureModal({
  open,
  onClose,
  onPhotoSelected,
  studentName = "Student",
  currentPhoto
}: PhotoCaptureModalProps) {
  const [mode, setMode] = useState<"choose" | "camera" | "preview">("choose");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!open) {
      stopCamera();
      setMode("choose");
      setPreviewUrl(null);
      setCameraError(null);
    }
  }, [open]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError(null);
    setMode("camera");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn("Live camera access failed or blocked:", err);
      setCameraError("Camera stream unavailable. Please use the device camera capture button below or choose a file.");
      setCameraActive(false);
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 480;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    stopCamera();
    setPreviewUrl(dataUrl);
    setMode("preview");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      stopCamera();
      setPreviewUrl(result);
      setMode("preview");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const confirmPhoto = () => {
    if (!previewUrl) return;
    onPhotoSelected(previewUrl);
    toast.success(`Photo updated for ${studentName}!`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#0A0A0A] border border-white/10 text-white rounded-3xl p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl font-bold uppercase tracking-wider text-white">
            Student Photo
          </DialogTitle>
          <DialogDescription className="text-white/60 font-body text-xs">
            Capture a live camera snapshot or upload an image for {studentName}.
          </DialogDescription>
        </DialogHeader>

        {/* Hidden File and Native Camera Inputs */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={handleFileChange}
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* MODE: CHOOSE */}
        {mode === "choose" && (
          <div className="space-y-6 pt-2">
            {/* Current photo preview if available */}
            {currentPhoto && (
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] font-heading uppercase tracking-widest text-white/40 mb-2">Current Photo</p>
                <img
                  src={currentPhoto}
                  alt={studentName}
                  className="w-24 h-24 rounded-2xl object-cover border border-[#D4AF37]/40 shadow-lg"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={startCamera}
                className="p-5 rounded-2xl bg-white/[0.03] hover:bg-[#D4AF37]/10 border border-white/10 hover:border-[#D4AF37]/50 flex flex-col items-center gap-3 text-center transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold uppercase text-white group-hover:text-[#D4AF37] transition-colors">
                    Live Camera
                  </h4>
                  <p className="text-[11px] text-white/50 font-body mt-0.5">
                    Open webcam or device camera
                  </p>
                </div>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-5 rounded-2xl bg-white/[0.03] hover:bg-[#D4AF37]/10 border border-white/10 hover:border-[#D4AF37]/50 flex flex-col items-center gap-3 text-center transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold uppercase text-white group-hover:text-[#D4AF37] transition-colors">
                    Upload File
                  </h4>
                  <p className="text-[11px] text-white/50 font-body mt-0.5">
                    Select from gallery or files
                  </p>
                </div>
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="text-xs text-[#D4AF37] hover:underline font-body"
              >
                Or use native mobile camera directly
              </button>
            </div>
          </div>
        )}

        {/* MODE: CAMERA LIVE STREAM */}
        {mode === "camera" && (
          <div className="space-y-4 pt-2">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black border border-white/10 flex items-center justify-center">
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />
              ) : (
                <div className="p-6 text-center space-y-3">
                  <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                  <p className="text-xs text-white/70 font-body leading-relaxed">
                    {cameraError || "Initializing camera..."}
                  </p>
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-heading text-xs uppercase font-bold"
                  >
                    Open System Camera
                  </button>
                </div>
              )}

              {/* Viewfinder Target Grid Overlay */}
              {cameraActive && (
                <div className="absolute inset-8 border border-white/30 rounded-full pointer-events-none" />
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  stopCamera();
                  setMode("choose");
                }}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-heading uppercase text-white/70"
              >
                Cancel
              </button>

              {cameraActive && (
                <GoldButton onClick={takeSnapshot} className="flex-1">
                  <Camera className="w-4 h-4 mr-2" />
                  Snap Photo
                </GoldButton>
              )}
            </div>
          </div>
        )}

        {/* MODE: PREVIEW */}
        {mode === "preview" && previewUrl && (
          <div className="space-y-5 pt-2">
            <div className="flex flex-col items-center justify-center">
              <div className="w-44 h-44 rounded-3xl overflow-hidden border-2 border-[#D4AF37] shadow-xl relative">
                <img
                  src={previewUrl}
                  alt="Student preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-white/50 font-body mt-2">Preview of student photo</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setPreviewUrl(null);
                  setMode("choose");
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-heading uppercase tracking-wider text-white flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Retake
              </button>

              <GoldButton onClick={confirmPhoto} className="flex-1">
                <Check className="w-4 h-4 mr-2" />
                Save Photo
              </GoldButton>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
