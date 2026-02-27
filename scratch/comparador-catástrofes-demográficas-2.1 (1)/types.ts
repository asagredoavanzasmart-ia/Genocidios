export interface GenocideData {
  id: string;
  name: string;
  deaths: number;
  deathsFormatted: string;
  startDate: string;
  endDate: string;
  duration: string;
  perpetrators: string;
  leader: string;
  victims: string; // Added affected group field
  location: {
    continent: string;
    country: string;
    city: string; // Or specific region if city is not applicable to the whole event
  };
  description: string;
  quote: string;
  color: string; // Base color for the 3D sphere
  // New fields for detailed description
  contextTitle: string;
  contextBody: string;
}

export interface ComparisonConfig {
  selectedIds: string[];
}