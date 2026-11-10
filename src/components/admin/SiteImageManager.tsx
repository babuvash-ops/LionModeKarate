// Lion Mode Karate Academy (https://lionmodekarate.com)
// Website & App Image Assets Manager
// Full photo file uploading, image removal, editable headings & descriptions, and Firestore sync

import { useState, useRef } from "react";
import { 
  ImageIcon, 
  Upload, 
  Trash2, 
  RotateCcw, 
  Save, 
  ExternalLink, 
  Check, 
  Sparkles,
  Filter,
  Eye,
  CheckCircle2
} from "lucide-react";
import { 
  SITE_IMAGE_SLOTS, 
  SiteImageSlot, 
  useSiteImageDetails, 
  saveSiteImage, 
  removeSiteImage, 
  resetAllSiteImages, 
  processImageFile 
} from "@/hooks/useSiteImages";
import { toast } from "sonner";

export default function SiteImageManager() {
  const { images, meta } = useSiteImageDetails();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [imageInputs, setImageInputs] = useState<Record<string, string>>({});
  const [metaInputs, setMetaInputs] = useState<Record<string, { label: string; description: string }>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const categories = ["All", "Home & Landing", "Dojo Action & Programs", "App Heroes"];

  const filteredSlots = SITE_IMAGE_SLOTS.filter(
    slot => selectedCategory === "All" || slot.category === selectedCategory
  );

  const getEffectiveUrl = (key: string, defaultUrl: string) => {
    if (imageInputs[key] !== undefined) return imageInputs[key];
    return images[key] || defaultUrl;
  };

  const getEffectiveMeta = (key: string, defaultLabel: string, defaultDesc: string) => {
    if (metaInputs[key]) return metaInputs[key];
    if (meta[key]) return meta[key];
    return { label: defaultLabel, description: defaultDesc };
  };

  // Handle Photo File Upload
  const handleFileUpload = async (key: string, file: File) => {
    if (!file) return;
    setUploadingKey(key);
    try {
      toast.loading(`Optimizing and processing ${file.name}...`, { id: `upload-${key}` });
      const compressedDataUrl = await processImageFile(file, 1600, 0.85);
      setImageInputs(prev => ({ ...prev, [key]: compressedDataUrl }));
      toast.success("Photo loaded into preview! Click 'Save Changes' to publish.", { id: `upload-${key}` });
    } catch (err: any) {
      toast.error(err.message || "Failed to process image file.", { id: `upload-${key}` });
    } finally {
      setUploadingKey(null);
    }
  };

  // Handle Save for single card
  const handleSaveSlot = async (slot: SiteImageSlot) => {
    setSavingKey(slot.key);
    try {
      const url = getEffectiveUrl(slot.key, slot.defaultUrl);
      const currentMeta = getEffectiveMeta(slot.key, slot.label, slot.description);
      await saveSiteImage(slot.key, url, currentMeta);
      toast.success(`Saved "${currentMeta.label}" image & details successfully!`);
    } catch (err) {
      toast.error("Failed to save image changes.");
    } finally {
      setSavingKey(null);
    }
  };

  // Handle Remove Image
  const handleRemoveSlot = (slot: SiteImageSlot) => {
    const blankSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'><rect width='800' height='500' fill='%230f0f0f'/><text x='50%' y='50%' font-family='sans-serif' font-size='20' fill='%23666666' text-anchor='middle' dominant-baseline='middle'>[No Image Selected - Upload Photo]</text></svg>";
    setImageInputs(prev => ({ ...prev, [slot.key]: blankSvg }));
    toast.info(`Removed photo from "${slot.label}". Click 'Save Changes' to confirm.`);
  };

  // Handle Restore Default
  const handleRestoreSlotDefault = (slot: SiteImageSlot) => {
    setImageInputs(prev => ({ ...prev, [slot.key]: slot.defaultUrl }));
    setMetaInputs(prev => ({
      ...prev,
      [slot.key]: { label: slot.label, description: slot.description }
    }));
    toast.info(`Restored "${slot.label}" to Lion Mode factory default.`);
  };

  // Handle Reset All
  const handleResetAll = async () => {
    if (confirm("Reset ALL images and headings across the entire website and app to Lion Mode defaults?")) {
      await resetAllSiteImages();
      setImageInputs({});
      setMetaInputs({});
      toast.info("All images and headings restored to Lion Mode Karate defaults.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02] border border-white/10 p-6 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-heading uppercase tracking-widest mb-1">
            <ImageIcon className="w-4 h-4" />
            <span>Media Assets & Photos • https://lionmodekarate.com</span>
          </div>
          <h2 className="font-heading text-2xl font-bold uppercase tracking-wider text-white">
            Website & App Image Assets & Photo Manager
          </h2>
          <p className="text-sm text-white/60 font-body max-w-2xl mt-1">
            Upload new photos from your phone or computer, remove old images, and customize the headings and text descriptions for each image across your website and app.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleResetAll}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 text-xs font-heading uppercase tracking-wider text-white/70 hover:text-rose-400 flex items-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Defaults</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <span className="text-xs font-heading uppercase tracking-wider text-white/40 flex items-center gap-1.5 mr-2">
          <Filter className="w-3.5 h-3.5" /> Filter Category:
        </span>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-heading uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-[#D4AF37] text-black font-bold shadow-md shadow-[#D4AF37]/20"
                : "bg-white/5 hover:bg-white/10 text-white/70 border border-white/10"
            }`}
          >
            {cat} {cat === "All" ? `(${SITE_IMAGE_SLOTS.length})` : `(${SITE_IMAGE_SLOTS.filter(s => s.category === cat).length})`}
          </button>
        ))}
      </div>

      {/* Image Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSlots.map(slot => {
          const currentUrl = getEffectiveUrl(slot.key, slot.defaultUrl);
          const currentMeta = getEffectiveMeta(slot.key, slot.label, slot.description);
          const isModified = (imageInputs[slot.key] !== undefined && imageInputs[slot.key] !== (images[slot.key] || slot.defaultUrl)) ||
            (metaInputs[slot.key] !== undefined);

          return (
            <div
              key={slot.key}
              className="bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/50 rounded-3xl overflow-hidden backdrop-blur-xl transition-all flex flex-col justify-between group shadow-xl"
            >
              <div>
                {/* Image Preview with Upload Overlay */}
                <div className="relative h-48 bg-black overflow-hidden border-b border-white/10">
                  <img
                    src={currentUrl}
                    alt={currentMeta.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = slot.defaultUrl;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />

                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-heading uppercase tracking-wider text-[#D4AF37] border border-[#D4AF37]/30">
                    {slot.category}
                  </span>

                  {isModified && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-[#D4AF37] text-black text-[9px] font-heading font-bold uppercase tracking-wider shadow">
                      Unsaved Changes
                    </span>
                  )}

                  {/* Actions overlay bar on top of image */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2">
                    {/* Hidden Native File Input */}
                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => (fileInputRefs.current[slot.key] = el)}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(slot.key, file);
                      }}
                      className="hidden"
                    />

                    <button
                      onClick={() => fileInputRefs.current[slot.key]?.click()}
                      disabled={uploadingKey === slot.key}
                      className="px-3 py-1.5 rounded-lg bg-black/80 hover:bg-[#D4AF37] hover:text-black border border-white/20 hover:border-[#D4AF37] text-white text-[11px] font-heading uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingKey === slot.key ? "Processing..." : "Upload New Photo"}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleRemoveSlot(slot)}
                        title="Remove current image"
                        className="p-1.5 rounded-lg bg-black/80 hover:bg-rose-500/80 border border-white/20 hover:border-rose-500 text-white/70 hover:text-white transition-all cursor-pointer backdrop-blur-md"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={currentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-black/80 hover:bg-black border border-white/20 text-white/70 hover:text-white transition-all cursor-pointer backdrop-blur-md"
                        title="View Full Resolution Photo"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Form Fields: Editable Heading, Description & URL */}
                <div className="p-5 space-y-3.5">
                  {/* Editable Heading / Label */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-heading uppercase tracking-widest text-[#D4AF37] flex items-center justify-between">
                      <span>Image Heading / Title:</span>
                      <span className="text-white/40 text-[9px] lowercase">editable</span>
                    </label>
                    <input
                      type="text"
                      value={currentMeta.label}
                      onChange={(e) => {
                        setMetaInputs(prev => ({
                          ...prev,
                          [slot.key]: {
                            label: e.target.value,
                            description: currentMeta.description
                          }
                        }));
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-heading font-bold text-white focus:outline-none focus:border-[#D4AF37]"
                      placeholder="Title / Heading"
                    />
                  </div>

                  {/* Editable Description / Caption */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-heading uppercase tracking-widest text-white/50 flex items-center justify-between">
                      <span>Description / Placement:</span>
                      <span className="text-white/40 text-[9px] lowercase">editable</span>
                    </label>
                    <textarea
                      rows={2}
                      value={currentMeta.description}
                      onChange={(e) => {
                        setMetaInputs(prev => ({
                          ...prev,
                          [slot.key]: {
                            label: currentMeta.label,
                            description: e.target.value
                          }
                        }));
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-body text-white/80 focus:outline-none focus:border-[#D4AF37]"
                      placeholder="Image description or caption..."
                    />
                  </div>

                  {/* Image URL / Source */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-heading uppercase tracking-widest text-white/50">
                      Photo Source (URL or Uploaded Data):
                    </label>
                    <input
                      type="text"
                      value={currentUrl.startsWith("data:") ? "[Uploaded Photo File from Device]" : currentUrl}
                      onChange={(e) => {
                        setImageInputs(prev => ({ ...prev, [slot.key]: e.target.value }));
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/90 font-mono placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37] truncate"
                      placeholder="https://... or click Upload above"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Actions: Restore Default & Save Changes */}
              <div className="p-5 pt-0 flex items-center justify-between gap-3 border-t border-white/5 mt-2">
                <button
                  onClick={() => handleRestoreSlotDefault(slot)}
                  className="text-[11px] text-white/40 hover:text-[#D4AF37] font-body underline cursor-pointer transition-colors"
                >
                  Restore Default
                </button>

                <button
                  onClick={() => handleSaveSlot(slot)}
                  disabled={savingKey === slot.key}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFB800] text-black text-xs font-heading uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#D4AF37]/20 hover:scale-[1.02] active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingKey === slot.key ? "Saving..." : "Save Image & Text"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
