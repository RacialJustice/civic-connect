// Kenya Counties Data
export const counties = [
  "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita Taveta", "Garissa",
  "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka Nithi", "Embu",
  "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga", "Murang'a",
  "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia", "Uasin Gishu",
  "Elgeyo Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado",
  "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", "Kisumu",
  "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi"
];

// Sample constituencies data (we'll expand this)
export const constituenciesByCounty: Record<string, string[]> = {
  "Nairobi": [
    "Westlands", "Dagoretti North", "Dagoretti South", "Langata", "Kibra",
    "Roysambu", "Kasarani", "Ruaraka", "Embakasi South", "Embakasi North",
    "Embakasi Central", "Embakasi East", "Embakasi West", "Makadara",
    "Kamukunji", "Starehe", "Mathare"
  ],
  "Kiambu": [
    "Gatundu South", "Gatundu North", "Juja", "Thika Town", "Ruiru",
    "Githunguri", "Kiambu", "Kiambaa", "Kabete", "Kikuyu", "Limuru",
    "Lari"
  ],
  // Add more counties and their constituencies
};

// Sample wards data (we'll expand this)
export const wardsByConstituency: Record<string, string[]> = {
  "Westlands": [
    "Kitisuru", "Parklands/Highridge", "Karura", "Kangemi", "Mountain View"
  ],
  "Dagoretti North": [
    "Kilimani", "Kawangware", "Gatina", "Kileleshwa", "Kabiro"
  ],
  "Kabete": [
    "Gitaru", "Muguga", "Nyadhuna", "Kabete", "Uthiru", "Kahuho"
  ],
  // Add more constituencies and their wards
};

// Validation functions
export function isValidCounty(county: string): boolean {
  return counties.includes(county);
}

export function isValidConstituencyInCounty(constituency: string, county: string): boolean {
  return constituenciesByCounty[county]?.includes(constituency) || false;
}

export function isValidWardInConstituency(ward: string, constituency: string): boolean {
  return wardsByConstituency[constituency]?.includes(ward) || false;
}

export function getConstituenciesForCounty(county: string): string[] {
  return constituenciesByCounty[county] || [];
}

export function getWardsForConstituency(constituency: string): string[] {
  return wardsByConstituency[constituency] || [];
}

export function getCountyByConstituency(constituency: string): string | null {
  for (const [county, constituencies] of Object.entries(constituenciesByCounty)) {
    if (constituencies.includes(constituency)) {
      return county;
    }
  }
  return null;
}
