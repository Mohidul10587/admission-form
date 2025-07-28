import { useState, useEffect } from "react";
import { defaultSettings } from "../shared/defaultData";

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/settings", {});

        if (!response.ok) {
          throw new Error("Failed to fetch settings");
        }

        const data = await response.json();
        setSettings(data);
      } catch (err) {
        setError("সেটিংস লোড করতে সমস্যা হয়েছে");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSettings();
  }, []);

  return {
    settings,
    isLoading,
    error,
  };
}
