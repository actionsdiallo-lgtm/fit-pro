"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ProgressView from "@/components/ProgressView";

export default function ProgresPage() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <ProgressView
      userEmail={session?.user?.email ?? null}
      onBack={() => router.push("/")}
      onOpenGoals={() => router.push("/entrainement")}
      onOpenRecords={() => router.push("/entrainement")}
      onOpenDetails={() => router.push("/entrainement")}
    />
  );
}
