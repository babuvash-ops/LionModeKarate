import React from "react";
import ClassesModule from "@/components/Classes";
import { useAuth } from "@/lib/AuthContext";

export default function ClassesPage() {
  const { user, profile } = useAuth();
  return <ClassesModule user={user} profile={profile} />;
}
