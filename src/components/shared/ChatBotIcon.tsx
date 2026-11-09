import React from 'react';

interface ChatBotIconProps {
  className?: string;
  size?: number | string;
  glow?: boolean;
}

/**
 * ChatBotIcon - Custom Gold AI Chatbot Icon for Sensei AI & Dojo OS
 * Designed with luxury obsidian & cinematic gold aesthetics (#D4AF37 -> #FFB800).
 * Features a friendly, playful robot advisor head with antenna, headset sensors,
 * and expressive glowing eyes.
 */
export const ChatBotIcon: React.FC<ChatBotIconProps> = ({ 
  className = "w-6 h-6", 
  size,
  glow = false 
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${glow ? 'filter drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]' : ''}`}
      style={style}
      aria-hidden="true"
    >
      <defs>
        {/* Primary Warm Gold Gradient */}
        <linearGradient id="goldBotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2A3" />
          <stop offset="30%" stopColor="#FFB800" />
          <stop offset="70%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#996515" />
        </linearGradient>

        {/* Inner Faceplate Shadow Gradient */}
        <linearGradient id="faceplateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1C180C" />
          <stop offset="100%" stopColor="#0A0A0A" />
        </linearGradient>

        {/* Eye Glow Gradient */}
        <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFBE6" />
          <stop offset="50%" stopColor="#FFE066" />
          <stop offset="100%" stopColor="#FFB800" />
        </linearGradient>

        {/* Ambient Ring Glow */}
        <radialGradient id="antennaOrbGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#FFE27A" />
          <stop offset="100%" stopColor="#D4AF37" />
        </radialGradient>
      </defs>

      {/* Top Antenna Stem & Orb */}
      <rect x="22.5" y="4" width="3" height="6.5" rx="1.5" fill="url(#goldBotGrad)" />
      <circle cx="24" cy="4" r="3.2" fill="url(#antennaOrbGrad)" stroke="#996515" strokeWidth="0.6" />
      <circle cx="23" cy="3" r="1" fill="#FFFFFF" opacity="0.9" />

      {/* Ear / Headset Nodes (Left & Right) */}
      <rect x="5.5" y="19" width="3.5" height="11" rx="1.75" fill="url(#goldBotGrad)" stroke="#7A5210" strokeWidth="0.5" />
      <rect x="39" y="19" width="3.5" height="11" rx="1.75" fill="url(#goldBotGrad)" stroke="#7A5210" strokeWidth="0.5" />
      <line x1="9" y1="24.5" x2="10.5" y2="24.5" stroke="url(#goldBotGrad)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="37.5" y1="24.5" x2="39" y2="24.5" stroke="url(#goldBotGrad)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Main Robot Outer Head (Rounded Squircle) */}
      <rect
        x="9.5"
        y="11.5"
        width="29"
        height="26"
        rx="8"
        fill="url(#goldBotGrad)"
        stroke="#7A5210"
        strokeWidth="0.8"
      />

      {/* Outer Head Specular Highlight */}
      <path
        d="M17.5 13.5H30.5C34.5 13.5 36.5 15.5 36.5 18"
        stroke="#FFFFFF"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Inner Screen / Visor Faceplate */}
      <rect
        x="13"
        y="15"
        width="22"
        height="18"
        rx="5.5"
        fill="url(#faceplateGrad)"
        stroke="url(#goldBotGrad)"
        strokeWidth="1.2"
      />

      {/* Friendly Expressive Glowing Eyes */}
      {/* Left Eye */}
      <rect x="17.5" y="19.5" width="4" height="6.5" rx="2" fill="url(#eyeGrad)" />
      <circle cx="18.7" cy="20.8" r="0.9" fill="#FFFFFF" />

      {/* Right Eye */}
      <rect x="26.5" y="19.5" width="4" height="6.5" rx="2" fill="url(#eyeGrad)" />
      <circle cx="27.7" cy="20.8" r="0.9" fill="#FFFFFF" />

      {/* Cheerful Robot Smile */}
      <path
        d="M20 28.5C21.2 30 26.8 30 28 28.5"
        stroke="url(#goldBotGrad)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Subtle Cheek Tech Dots / Glow */}
      <circle cx="15.8" cy="25" r="0.8" fill="#FFB800" opacity="0.6" />
      <circle cx="32.2" cy="25" r="0.8" fill="#FFB800" opacity="0.6" />

      {/* Bottom Neck Collar Joint */}
      <rect x="19" y="38" width="10" height="3" rx="1.5" fill="url(#goldBotGrad)" stroke="#7A5210" strokeWidth="0.5" />
      <line x1="22.5" y1="39.5" x2="25.5" y2="39.5" stroke="#1C180C" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
};

export default ChatBotIcon;
