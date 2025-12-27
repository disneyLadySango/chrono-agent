"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { LinearSettings } from "@/components/settings/LinearSettings";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <AuthGuard>
      <div className="container mx-auto max-w-2xl py-8 px-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="space-y-6">
          <LinearSettings />
        </div>
      </div>
    </AuthGuard>
  );
}
