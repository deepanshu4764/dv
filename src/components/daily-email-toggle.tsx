"use client";

import { useState } from "react";
import { Button } from "./ui/button";

export function DailyEmailToggle({ initial }: { initial: boolean }) {
  const [optIn, setOptIn] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const toggle = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dailyEmailOptIn: !optIn })
      });
      if (!res.ok) throw new Error("Failed");
      setOptIn((prev) => !prev);
      setMessage(!optIn ? "Daily emails enabled" : "Daily emails disabled");
    } catch (error) {
      setMessage("Could not update preference");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">Daily insight emails</p>
          <p className="text-xs text-slate-500">Receive the day’s insight in your inbox.</p>
        </div>
        <Button variant="secondary" onClick={toggle} disabled={saving}>
          {saving ? "Saving..." : optIn ? "Turn off" : "Turn on"}
        </Button>
      </div>
      {message ? <p className="text-xs text-slate-500">{message}</p> : null}
    </div>
  );
}
