"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { syncLinearTasks } from "@/lib/linear";
import { Loader2, RefreshCw, Check, AlertCircle } from "lucide-react";

const LINEAR_API_KEY_STORAGE_KEY = "chrono_agent_linear_api_key";

export function LinearSettings() {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState("");
  const [savedApiKey, setSavedApiKey] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    // Load saved API key from localStorage
    const stored = localStorage.getItem(LINEAR_API_KEY_STORAGE_KEY);
    if (stored) {
      setSavedApiKey(stored);
      setApiKey(stored);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem(LINEAR_API_KEY_STORAGE_KEY, apiKey.trim());
      setSavedApiKey(apiKey.trim());
      setSyncResult({ success: true, message: "API key saved" });
      setTimeout(() => setSyncResult(null), 3000);
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem(LINEAR_API_KEY_STORAGE_KEY);
    setSavedApiKey(null);
    setApiKey("");
    setSyncResult(null);
  };

  const handleSync = async () => {
    if (!savedApiKey || !user) return;

    try {
      setSyncing(true);
      setSyncResult(null);

      const result = await syncLinearTasks(savedApiKey, user.id);

      if (result.errors.length > 0) {
        setSyncResult({
          success: false,
          message: `Synced ${result.synced} tasks with ${result.errors.length} errors`,
        });
      } else {
        setSyncResult({
          success: true,
          message: `Successfully synced ${result.synced} tasks from Linear`,
        });
      }
    } catch (err) {
      setSyncResult({
        success: false,
        message: err instanceof Error ? err.message : "Failed to sync tasks",
      });
    } finally {
      setSyncing(false);
    }
  };

  const maskedApiKey = savedApiKey
    ? `${savedApiKey.slice(0, 8)}${"*".repeat(Math.max(0, savedApiKey.length - 12))}${savedApiKey.slice(-4)}`
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Linear Integration</CardTitle>
        <CardDescription>
          Connect your Linear account to sync issues as tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {savedApiKey ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">
                API Key: {maskedApiKey}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSync}
                disabled={syncing || !user}
                className="flex-1"
              >
                {syncing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Sync Now
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleClearApiKey}>
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linear-api-key">API Key</Label>
              <Input
                id="linear-api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="lin_api_..."
              />
              <p className="text-xs text-muted-foreground">
                Get your API key from{" "}
                <a
                  href="https://linear.app/settings/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  Linear Settings → API
                </a>
              </p>
            </div>

            <Button onClick={handleSaveApiKey} disabled={!apiKey.trim()}>
              Save API Key
            </Button>
          </div>
        )}

        {syncResult && (
          <div
            className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
              syncResult.success
                ? "border border-green-500/20 bg-green-500/10 text-green-500"
                : "border border-destructive/20 bg-destructive/10 text-destructive"
            }`}
          >
            {syncResult.success ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {syncResult.message}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
