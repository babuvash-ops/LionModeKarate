import React from "react";
import { useNavigate } from "react-router-dom";
import TVDashboard from "@/components/TVDashboard";

export default function TVModePage() {
  const navigate = useNavigate();

  return (
    <TVDashboard
      branding={{ dojoName: "LION MODE KARATE" }}
      onClose={() => navigate("/dashboard")}
    />
  );
}
