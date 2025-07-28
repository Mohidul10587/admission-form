// lib/fetchSettings.ts
export interface Settings {
  logoUrl: string;
  primaryColor: string;
  paymentAmount: number;
  sendMonyNumbers: string[];
}

export async function getSettings(): Promise<Settings> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/settings`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch settings  shared");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw new Error("Settings fetch failed");
  }
}
