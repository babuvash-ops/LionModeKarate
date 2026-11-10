// Lion Mode Karate Academy (https://lionmodekarate.com)
// Website & App Content Manager (CMS)
// Real-time customizer for all Headings, Subtitles, Paragraphs, Badges, Buttons & App Banners

import { useState, useEffect } from "react";
import { 
  Type, 
  Save, 
  RotateCcw, 
  Sparkles, 
  Layout, 
  Bot, 
  Award, 
  ShoppingBag, 
  Info, 
  PhoneCall, 
  Smartphone,
  CheckCircle2,
  Eye
} from "lucide-react";
import { useSiteContent, saveSiteContent, resetSiteContent, SiteContent, DEFAULT_SITE_CONTENT } from "@/hooks/useSiteContent";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function SiteContentManager() {
  const liveContent = useSiteContent();
  const [formData, setFormData] = useState<SiteContent>(liveContent);
  const [activeSection, setActiveSection] = useState<
    "hero" | "sensei" | "programs" | "about" | "shop" | "contact" | "app"
  >("hero");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(liveContent);
  }, [liveContent]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSiteContent(formData);
      toast.success("Website & App content saved successfully!", {
        description: "Your custom headings, paragraphs, and descriptions are now live across the site and app."
      });
    } catch (e) {
      toast.error("Failed to save content changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm("Reset all headings, descriptions, and text to Lion Mode factory defaults?")) {
      await resetSiteContent();
      setFormData(DEFAULT_SITE_CONTENT);
      toast.info("All site copy restored to original Lion Mode defaults.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02] border border-white/10 p-6 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-heading uppercase tracking-widest mb-1">
            <Type className="w-4 h-4" />
            <span>Website & App Text CMS • Full Customization</span>
          </div>
          <h2 className="font-heading text-2xl font-bold uppercase tracking-wider text-white">
            Website & App Content & Text Editor
          </h2>
          <p className="text-sm text-white/60 font-body max-w-2xl mt-1">
            Change any heading, paragraph, description, badge, and button text across your Home Page and Member App sections. All edits sync directly to Firestore and take effect immediately.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" target="_blank">
            <button className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-heading uppercase tracking-wider text-white flex items-center gap-2 transition-all cursor-pointer">
              <Eye className="w-4 h-4 text-[#D4AF37]" />
              <span>Preview Live Site</span>
            </button>
          </Link>

          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 text-xs font-heading uppercase tracking-wider text-white/70 hover:text-rose-400 flex items-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFB800] text-black text-xs font-heading uppercase tracking-wider font-bold hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#D4AF37]/20"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save All Content Changes"}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
        {[
          { id: "hero", label: "Hero & Main Banner", icon: Layout },
          { id: "sensei", label: "Sensei AI Hub Block", icon: Bot },
          { id: "programs", label: "Curriculum Programs", icon: Award },
          { id: "about", label: "About Dojo Section", icon: Info },
          { id: "shop", label: "Pro Shop Showcase", icon: ShoppingBag },
          { id: "contact", label: "Contact & Free Trial", icon: PhoneCall },
          { id: "app", label: "App & Portal Banners", icon: Smartphone }
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-heading uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                active 
                  ? "bg-[#D4AF37] text-black font-bold shadow-md shadow-[#D4AF37]/30" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: HERO & MAIN BANNER */}
      {activeSection === "hero" && (
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 backdrop-blur-xl">
          <div className="border-b border-white/10 pb-4">
            <h3 className="font-heading text-xl font-bold uppercase text-white">
              Website Main Hero Section
            </h3>
            <p className="text-xs text-white/50 font-body mt-1">
              Configure the headline words, subtitle paragraph, action buttons, and stat counters on the home page hero.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                Heading Line 1
              </label>
              <input
                type="text"
                value={formData.hero.headingLine1}
                onChange={(e) => setFormData({
                  ...formData,
                  hero: { ...formData.hero, headingLine1: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-heading text-lg focus:outline-none focus:border-[#D4AF37]"
                placeholder="FORGE YOUR"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-[#D4AF37]">
                Highlighted Word (Gold Accent)
              </label>
              <input
                type="text"
                value={formData.hero.headingHighlight}
                onChange={(e) => setFormData({
                  ...formData,
                  hero: { ...formData.hero, headingHighlight: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[#D4AF37]/40 text-[#D4AF37] font-heading text-lg focus:outline-none focus:border-[#D4AF37]"
                placeholder="WARRIOR"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                Heading Line 2
              </label>
              <input
                type="text"
                value={formData.hero.headingLine2}
                onChange={(e) => setFormData({
                  ...formData,
                  hero: { ...formData.hero, headingLine2: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-heading text-lg focus:outline-none focus:border-[#D4AF37]"
                placeholder="SPIRIT"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-heading uppercase tracking-wider text-white/70">
              Hero Subtitle / Description Paragraph
            </label>
            <textarea
              rows={3}
              value={formData.hero.subtitle}
              onChange={(e) => setFormData({
                ...formData,
                hero: { ...formData.hero, subtitle: e.target.value }
              })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white font-body focus:outline-none focus:border-[#D4AF37]"
              placeholder="Enter hero paragraph description..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                Primary Button Text
              </label>
              <input
                type="text"
                value={formData.hero.primaryButtonText}
                onChange={(e) => setFormData({
                  ...formData,
                  hero: { ...formData.hero, primaryButtonText: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                Secondary Button Text
              </label>
              <input
                type="text"
                value={formData.hero.secondaryButtonText}
                onChange={(e) => setFormData({
                  ...formData,
                  hero: { ...formData.hero, secondaryButtonText: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                Shop Button Text
              </label>
              <input
                type="text"
                value={formData.hero.shopButtonText}
                onChange={(e) => setFormData({
                  ...formData,
                  hero: { ...formData.hero, shopButtonText: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Stat Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/5">
            <div className="space-y-1">
              <label className="text-[10px] font-heading uppercase tracking-wider text-white/50">Stat 1 Value</label>
              <input
                type="text"
                value={formData.hero.stat1Value}
                onChange={(e) => setFormData({
                  ...formData,
                  hero: { ...formData.hero, stat1Value: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-heading text-base"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-heading uppercase tracking-wider text-white/50">Stat 1 Label</label>
              <input
                type="text"
                value={formData.hero.stat1Label}
                onChange={(e) => setFormData({
                  ...formData,
                  hero: { ...formData.hero, stat1Label: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-body"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-heading uppercase tracking-wider text-white/50">Stat 2 Value</label>
              <input
                type="text"
                value={formData.hero.stat2Value}
                onChange={(e) => setFormData({
                  ...formData,
                  hero: { ...formData.hero, stat2Value: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-heading text-base"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-heading uppercase tracking-wider text-white/50">Stat 2 Label</label>
              <input
                type="text"
                value={formData.hero.stat2Label}
                onChange={(e) => setFormData({
                  ...formData,
                  hero: { ...formData.hero, stat2Label: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-body"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: SENSEI AI HUB */}
      {activeSection === "sensei" && (
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 backdrop-blur-xl">
          <div className="border-b border-white/10 pb-4">
            <h3 className="font-heading text-xl font-bold uppercase text-white">
              Sensei AI Hub Interactive Block (Home Page)
            </h3>
            <p className="text-xs text-white/50 font-body mt-1">
              Customize the black chat bot card on the home page linking to your dedicated digital martial arts advisor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                Pill Badge Text
              </label>
              <input
                type="text"
                value={formData.senseiAi.badge}
                onChange={(e) => setFormData({
                  ...formData,
                  senseiAi: { ...formData.senseiAi, badge: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                Card Title Prefix
              </label>
              <input
                type="text"
                value={formData.senseiAi.title}
                onChange={(e) => setFormData({
                  ...formData,
                  senseiAi: { ...formData.senseiAi, title: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-[#D4AF37]">
                Highlighted Title Word
              </label>
              <input
                type="text"
                value={formData.senseiAi.highlight}
                onChange={(e) => setFormData({
                  ...formData,
                  senseiAi: { ...formData.senseiAi, highlight: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[#D4AF37]/40 text-[#D4AF37] text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-heading uppercase tracking-wider text-white/70">
              Sensei Card Description
            </label>
            <textarea
              rows={3}
              value={formData.senseiAi.description}
              onChange={(e) => setFormData({
                ...formData,
                senseiAi: { ...formData.senseiAi, description: e.target.value }
              })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white font-body"
            />
          </div>

          <div className="space-y-1.5 max-w-sm">
            <label className="text-xs font-heading uppercase tracking-wider text-white/70">
              Button Action Text
            </label>
            <input
              type="text"
              value={formData.senseiAi.buttonText}
              onChange={(e) => setFormData({
                ...formData,
                senseiAi: { ...formData.senseiAi, buttonText: e.target.value }
              })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white"
            />
          </div>
        </div>
      )}

      {/* SECTION 3: CURRICULUM PROGRAMS */}
      {activeSection === "programs" && (
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 space-y-8 backdrop-blur-xl">
          <div className="border-b border-white/10 pb-4">
            <h3 className="font-heading text-xl font-bold uppercase text-white">
              Curriculum Programs Section
            </h3>
            <p className="text-xs text-white/50 font-body mt-1">
              Customize the section header and every individual program card (ages, titles, badges, and curriculum descriptions).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                Section Eyebrow
              </label>
              <input
                type="text"
                value={formData.programs.eyebrow}
                onChange={(e) => setFormData({
                  ...formData,
                  programs: { ...formData.programs, eyebrow: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                Heading Prefix
              </label>
              <input
                type="text"
                value={formData.programs.heading}
                onChange={(e) => setFormData({
                  ...formData,
                  programs: { ...formData.programs, heading: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-[#D4AF37]">
                Highlighted Words
              </label>
              <input
                type="text"
                value={formData.programs.highlight}
                onChange={(e) => setFormData({
                  ...formData,
                  programs: { ...formData.programs, highlight: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[#D4AF37]/40 text-[#D4AF37] text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-heading uppercase tracking-wider text-white/70">
              Section Intro Paragraph
            </label>
            <textarea
              rows={2}
              value={formData.programs.description}
              onChange={(e) => setFormData({
                ...formData,
                programs: { ...formData.programs, description: e.target.value }
              })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white font-body"
            />
          </div>

          {/* Program Cards */}
          <div className="space-y-6 pt-4 border-t border-white/10">
            <h4 className="font-heading text-lg font-bold uppercase text-[#D4AF37]">
              Individual Program Cards ({formData.programs.list.length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.programs.list.map((prog, index) => (
                <div
                  key={prog.id || index}
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-heading font-bold uppercase text-[#D4AF37]">
                      Program #{index + 1}
                    </span>
                    <input
                      type="text"
                      value={prog.badge}
                      onChange={(e) => {
                        const updated = [...formData.programs.list];
                        updated[index] = { ...updated[index], badge: e.target.value };
                        setFormData({ ...formData, programs: { ...formData.programs, list: updated } });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-heading uppercase tracking-widest font-bold"
                      placeholder="Badge"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-heading uppercase text-white/50">Program Name</label>
                      <input
                        type="text"
                        value={prog.title}
                        onChange={(e) => {
                          const updated = [...formData.programs.list];
                          updated[index] = { ...updated[index], title: e.target.value };
                          setFormData({ ...formData, programs: { ...formData.programs, list: updated } });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-heading font-bold text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-heading uppercase text-white/50">Age Range Tag</label>
                      <input
                        type="text"
                        value={prog.age}
                        onChange={(e) => {
                          const updated = [...formData.programs.list];
                          updated[index] = { ...updated[index], age: e.target.value };
                          setFormData({ ...formData, programs: { ...formData.programs, list: updated } });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-heading uppercase text-white/50">Description Paragraph</label>
                    <textarea
                      rows={2}
                      value={prog.desc}
                      onChange={(e) => {
                        const updated = [...formData.programs.list];
                        updated[index] = { ...updated[index], desc: e.target.value };
                        setFormData({ ...formData, programs: { ...formData.programs, list: updated } });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-body"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-heading uppercase text-white/50">Curriculum Features (Comma Separated)</label>
                    <input
                      type="text"
                      value={prog.features.join(", ")}
                      onChange={(e) => {
                        const updated = [...formData.programs.list];
                        updated[index] = {
                          ...updated[index],
                          features: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                        };
                        setFormData({ ...formData, programs: { ...formData.programs, list: updated } });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-heading uppercase text-white/50">Button Label</label>
                    <input
                      type="text"
                      value={prog.buttonText}
                      onChange={(e) => {
                        const updated = [...formData.programs.list];
                        updated[index] = { ...updated[index], buttonText: e.target.value };
                        setFormData({ ...formData, programs: { ...formData.programs, list: updated } });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#D4AF37]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: ABOUT DOJO */}
      {activeSection === "about" && (
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 backdrop-blur-xl">
          <div className="border-b border-white/10 pb-4">
            <h3 className="font-heading text-xl font-bold uppercase text-white">
              About Dojo Section
            </h3>
            <p className="text-xs text-white/50 font-body mt-1">
              Edit the rich academy story, heritage text, and action buttons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                Eyebrow Text
              </label>
              <input
                type="text"
                value={formData.about.eyebrow}
                onChange={(e) => setFormData({
                  ...formData,
                  about: { ...formData.about, eyebrow: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                Heading Prefix
              </label>
              <input
                type="text"
                value={formData.about.heading}
                onChange={(e) => setFormData({
                  ...formData,
                  about: { ...formData.about, heading: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-[#D4AF37]">
                Highlighted Word
              </label>
              <input
                type="text"
                value={formData.about.highlight}
                onChange={(e) => setFormData({
                  ...formData,
                  about: { ...formData.about, highlight: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[#D4AF37]/40 text-[#D4AF37] text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-heading uppercase tracking-wider text-white/70">
              Story Paragraph 1
            </label>
            <textarea
              rows={3}
              value={formData.about.storyParagraph1}
              onChange={(e) => setFormData({
                ...formData,
                about: { ...formData.about, storyParagraph1: e.target.value }
              })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white font-body"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-heading uppercase tracking-wider text-white/70">
              Story Paragraph 2
            </label>
            <textarea
              rows={3}
              value={formData.about.storyParagraph2}
              onChange={(e) => setFormData({
                ...formData,
                about: { ...formData.about, storyParagraph2: e.target.value }
              })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white font-body"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                Primary Button Label
              </label>
              <input
                type="text"
                value={formData.about.primaryButtonText}
                onChange={(e) => setFormData({
                  ...formData,
                  about: { ...formData.about, primaryButtonText: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                Secondary Button Label
              </label>
              <input
                type="text"
                value={formData.about.secondaryButtonText}
                onChange={(e) => setFormData({
                  ...formData,
                  about: { ...formData.about, secondaryButtonText: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: PRO SHOP */}
      {activeSection === "shop" && (
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 backdrop-blur-xl">
          <div className="border-b border-white/10 pb-4">
            <h3 className="font-heading text-xl font-bold uppercase text-white">
              Pro Shop Showcase (Home Page)
            </h3>
            <p className="text-xs text-white/50 font-body mt-1">
              Customize the gear shop preview section displayed on the landing page.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                Section Eyebrow
              </label>
              <input
                type="text"
                value={formData.shopShowcase.eyebrow}
                onChange={(e) => setFormData({
                  ...formData,
                  shopShowcase: { ...formData.shopShowcase, eyebrow: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                Heading Prefix
              </label>
              <input
                type="text"
                value={formData.shopShowcase.heading}
                onChange={(e) => setFormData({
                  ...formData,
                  shopShowcase: { ...formData.shopShowcase, heading: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-[#D4AF37]">
                Highlighted Word
              </label>
              <input
                type="text"
                value={formData.shopShowcase.highlight}
                onChange={(e) => setFormData({
                  ...formData,
                  shopShowcase: { ...formData.shopShowcase, highlight: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[#D4AF37]/40 text-[#D4AF37] text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-heading uppercase tracking-wider text-white/70">
              Description Paragraph
            </label>
            <textarea
              rows={2}
              value={formData.shopShowcase.description}
              onChange={(e) => setFormData({
                ...formData,
                shopShowcase: { ...formData.shopShowcase, description: e.target.value }
              })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white font-body"
            />
          </div>

          <div className="space-y-1.5 max-w-sm">
            <label className="text-xs font-heading uppercase tracking-wider text-white/70">
              Button Text
            </label>
            <input
              type="text"
              value={formData.shopShowcase.buttonText}
              onChange={(e) => setFormData({
                ...formData,
                shopShowcase: { ...formData.shopShowcase, buttonText: e.target.value }
              })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white"
            />
          </div>
        </div>
      )}

      {/* SECTION 6: CONTACT & FREE TRIAL */}
      {activeSection === "contact" && (
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 backdrop-blur-xl">
          <div className="border-b border-white/10 pb-4">
            <h3 className="font-heading text-xl font-bold uppercase text-white">
              Contact & Free Trial Booking Section
            </h3>
            <p className="text-xs text-white/50 font-body mt-1">
              Edit the contact information, head master title, dojo training hours, and booking button label.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                Heading Prefix
              </label>
              <input
                type="text"
                value={formData.contact.heading}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, heading: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-[#D4AF37]">
                Highlighted Word
              </label>
              <input
                type="text"
                value={formData.contact.highlight}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, highlight: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[#D4AF37]/40 text-[#D4AF37] text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                Form Submit Button Text
              </label>
              <input
                type="text"
                value={formData.contact.formButtonText}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, formButtonText: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-[#D4AF37]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-heading uppercase tracking-wider text-white/70">
              Subtitle Paragraph
            </label>
            <textarea
              rows={2}
              value={formData.contact.subtitle}
              onChange={(e) => setFormData({
                ...formData,
                contact: { ...formData.contact, subtitle: e.target.value }
              })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white font-body"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                Contact Email Address
              </label>
              <input
                type="text"
                value={formData.contact.email}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, email: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                Head Master / Instructor
              </label>
              <input
                type="text"
                value={formData.contact.headMaster}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, headMaster: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                Dojo Training Hours
              </label>
              <input
                type="text"
                value={formData.contact.trainingHours}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, trainingHours: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: APP & PORTAL BANNERS */}
      {activeSection === "app" && (
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 backdrop-blur-xl">
          <div className="border-b border-white/10 pb-4">
            <h3 className="font-heading text-xl font-bold uppercase text-white">
              Member App & Portal Banners
            </h3>
            <p className="text-xs text-white/50 font-body mt-1">
              Customize the titles, subtitles, and daily Sensei quote shown across the internal member and staff modules.
            </p>
          </div>

          {/* Daily Sensei Quote / Dojo Announcement */}
          <div className="p-5 rounded-2xl bg-[#D4AF37]/5 border border-[#D4AF37]/30 space-y-2">
            <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-heading uppercase tracking-widest font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Daily Sensei Quote & Dojo Announcement</span>
            </div>
            <textarea
              rows={2}
              value={formData.app.senseiQuote}
              onChange={(e) => setFormData({
                ...formData,
                app: { ...formData.app, senseiQuote: e.target.value }
              })}
              className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-sm text-white font-body focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Dashboard */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
              <span className="text-xs font-heading uppercase font-bold text-[#D4AF37]">
                Dashboard Hero Banner
              </span>
              <input
                type="text"
                value={formData.app.dashboardTitle}
                onChange={(e) => setFormData({
                  ...formData,
                  app: { ...formData.app, dashboardTitle: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-heading font-bold text-white"
                placeholder="Title"
              />
              <input
                type="text"
                value={formData.app.dashboardSubtitle}
                onChange={(e) => setFormData({
                  ...formData,
                  app: { ...formData.app, dashboardSubtitle: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70"
                placeholder="Subtitle"
              />
            </div>

            {/* Class Schedule */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
              <span className="text-xs font-heading uppercase font-bold text-[#D4AF37]">
                Class Schedule Module
              </span>
              <input
                type="text"
                value={formData.app.classesTitle}
                onChange={(e) => setFormData({
                  ...formData,
                  app: { ...formData.app, classesTitle: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-heading font-bold text-white"
                placeholder="Title"
              />
              <input
                type="text"
                value={formData.app.classesSubtitle}
                onChange={(e) => setFormData({
                  ...formData,
                  app: { ...formData.app, classesSubtitle: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70"
                placeholder="Subtitle"
              />
            </div>

            {/* Students Personnel */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
              <span className="text-xs font-heading uppercase font-bold text-[#D4AF37]">
                Student Directory & Roster
              </span>
              <input
                type="text"
                value={formData.app.studentsTitle}
                onChange={(e) => setFormData({
                  ...formData,
                  app: { ...formData.app, studentsTitle: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-heading font-bold text-white"
                placeholder="Title"
              />
              <input
                type="text"
                value={formData.app.studentsSubtitle}
                onChange={(e) => setFormData({
                  ...formData,
                  app: { ...formData.app, studentsSubtitle: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70"
                placeholder="Subtitle"
              />
            </div>

            {/* Video Curriculum */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
              <span className="text-xs font-heading uppercase font-bold text-[#D4AF37]">
                Video Curriculum & Library
              </span>
              <input
                type="text"
                value={formData.app.videosTitle}
                onChange={(e) => setFormData({
                  ...formData,
                  app: { ...formData.app, videosTitle: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-heading font-bold text-white"
                placeholder="Title"
              />
              <input
                type="text"
                value={formData.app.videosSubtitle}
                onChange={(e) => setFormData({
                  ...formData,
                  app: { ...formData.app, videosSubtitle: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70"
                placeholder="Subtitle"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
