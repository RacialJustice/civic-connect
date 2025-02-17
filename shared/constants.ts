import { counties } from "./counties-data";

export type County = typeof counties[number];

export const TOTAL_CONSTITUENCIES = 290;
export const TOTAL_WARDS = 1450;

// Helper functions
export function getCountyByConstituency(constituencyName: string): string | null {
  // This is a simplified example - in a real application, you would have a complete
  // mapping of constituencies to counties
  const constituencyToCounty: Record<string, string> = {
    "Westlands": "Nairobi",
    "Dagoretti North": "Nairobi", 
    "Dagoretti South": "Nairobi",
    "Langata": "Nairobi",
    "Kibra": "Nairobi",
    "Roysambu": "Nairobi",
    "Kasarani": "Nairobi",
    "Ruaraka": "Nairobi",
    "Embakasi South": "Nairobi",
    "Embakasi North": "Nairobi",
    "Embakasi Central": "Nairobi",
    "Embakasi East": "Nairobi",
    "Embakasi West": "Nairobi",
    "Makadara": "Nairobi",
    "Kamukunji": "Nairobi",
    "Starehe": "Nairobi",
    "Mathare": "Nairobi",
    "Kabete": "Kiambu", // Added Kabete constituency
    // Add more constituency to county mappings as needed
  };

  return constituencyToCounty[constituencyName] || null;
}

export function validateWardInConstituency(ward: string, constituency: string): boolean {
  // This is a simplified example - in a real application, you would have a complete
  // mapping of wards to constituencies
  const constituencyWards: Record<string, string[]> = {
    "Westlands": ["Kitisuru", "Parklands/Highridge", "Karura", "Kangemi", "Mountain View"],
    "Dagoretti North": ["Kilimani", "Kawangware", "Gatina", "Kileleshwa", "Kabiro"],
    "Kabete": ["Kabete", "Nyathuna", "Gitaru", "Muguga", "Nyadhuna"], // Added Kabete wards
    // Add more constituency to wards mappings as needed
  };

  const wardsInConstituency = constituencyWards[constituency];
  if (!wardsInConstituency) return false;

  return wardsInConstituency.includes(ward);
}