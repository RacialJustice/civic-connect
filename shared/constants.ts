export const counties = [
  { id: 1, name: "Mombasa", constituencies: 6, wards: 30 },
  { id: 2, name: "Kwale", constituencies: 4, wards: 20 },
  { id: 3, name: "Kilifi", constituencies: 7, wards: 35 },
  { id: 4, name: "Tana River", constituencies: 3, wards: 15 },
  { id: 5, name: "Lamu", constituencies: 2, wards: 10 },
  { id: 6, name: "Taita Taveta", constituencies: 4, wards: 20 },
  { id: 7, name: "Garissa", constituencies: 6, wards: 30 },
  { id: 8, name: "Wajir", constituencies: 6, wards: 30 },
  { id: 9, name: "Mandera", constituencies: 6, wards: 30 },
  { id: 10, name: "Marsabit", constituencies: 4, wards: 20 },
  { id: 11, name: "Isiolo", constituencies: 2, wards: 10 },
  { id: 12, name: "Meru", constituencies: 9, wards: 45 },
  { id: 13, name: "Tharaka-Nithi", constituencies: 3, wards: 15 },
  { id: 14, name: "Embu", constituencies: 4, wards: 20 },
  { id: 15, name: "Kitui", constituencies: 8, wards: 40 },
  { id: 16, name: "Machakos", constituencies: 8, wards: 40 },
  { id: 17, name: "Makueni", constituencies: 6, wards: 30 },
  { id: 18, name: "Nyandarua", constituencies: 5, wards: 25 },
  { id: 19, name: "Nyeri", constituencies: 6, wards: 30 },
  { id: 20, name: "Kirinyaga", constituencies: 4, wards: 20 },
  { id: 21, name: "Murang'a", constituencies: 7, wards: 35 },
  { id: 22, name: "Kiambu", constituencies: 12, wards: 60 },
  { id: 23, name: "Turkana", constituencies: 6, wards: 30 },
  { id: 24, name: "West Pokot", constituencies: 4, wards: 20 },
  { id: 25, name: "Samburu", constituencies: 3, wards: 15 },
  { id: 26, name: "Trans Nzoia", constituencies: 5, wards: 25 },
  { id: 27, name: "Uasin Gishu", constituencies: 6, wards: 30 },
  { id: 28, name: "Elgeyo Marakwet", constituencies: 4, wards: 20 },
  { id: 29, name: "Nandi", constituencies: 6, wards: 30 },
  { id: 30, name: "Baringo", constituencies: 6, wards: 30 },
  { id: 31, name: "Laikipia", constituencies: 3, wards: 15 },
  { id: 32, name: "Nakuru", constituencies: 11, wards: 55 },
  { id: 33, name: "Narok", constituencies: 6, wards: 30 },
  { id: 34, name: "Kajiado", constituencies: 5, wards: 25 },
  { id: 35, name: "Kericho", constituencies: 6, wards: 30 },
  { id: 36, name: "Bomet", constituencies: 5, wards: 25 },
  { id: 37, name: "Kakamega", constituencies: 12, wards: 60 },
  { id: 38, name: "Vihiga", constituencies: 5, wards: 25 },
  { id: 39, name: "Bungoma", constituencies: 9, wards: 45 },
  { id: 40, name: "Busia", constituencies: 7, wards: 35 },
  { id: 41, name: "Siaya", constituencies: 6, wards: 30 },
  { id: 42, name: "Kisumu", constituencies: 7, wards: 35 },
  { id: 43, name: "Homa Bay", constituencies: 8, wards: 40 },
  { id: 44, name: "Migori", constituencies: 8, wards: 40 },
  { id: 45, name: "Kisii", constituencies: 9, wards: 45 },
  { id: 46, name: "Nyamira", constituencies: 4, wards: 20 },
  { id: 47, name: "Nairobi", constituencies: 17, wards: 85 }
] as const;

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
    // Add more constituency to wards mappings as needed
  };

  const wardsInConstituency = constituencyWards[constituency];
  if (!wardsInConstituency) return false;

  return wardsInConstituency.includes(ward);
}
