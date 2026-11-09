import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import StudentProfileComponent from "@/components/StudentProfile";

export default function StudentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <StudentProfileComponent
      studentId={id || "std-1"}
      branding={{ dojoName: "LION MODE KARATE" }}
      onBack={() => navigate("/students")}
    />
  );
}
