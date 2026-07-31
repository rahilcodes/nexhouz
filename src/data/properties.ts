export interface LuxuryScore {
  architecturalIntegrity: number; // out of 100
  investmentYield: number; // percentage projection e.g. 8.4
  spatialEfficiency: number; // out of 100
  automationTier: "Tier 1 (Integrated)" | "Tier 2 (Pro)" | "Tier 3 (Elite)";
}

export interface NearbyAmenities {
  hospitals?: number;
  malls?: number;
  schools?: number;
  restaurants?: number;
  metroStations?: number;
  railwayStations?: number;
  itParks?: number;
  [key: string]: number | undefined;
}

export interface AQIData {
  score: number;
  dominantPollutant: string;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
}

export interface FloorPlan {
  type: string;    // e.g. "4 BHK", "3 BHK", "2 BHK", "Studio"
  size: number;    // sq ft
  facing: string;  // e.g. "East", "North", "West", "South"
  price: number;   // in INR
}

export interface RecommendationReport {
  investmentPotential: number;
  familyFriendliness: number;
  commuteConvenience: number;
  schoolAccess: number;
  hospitalAccess: number;
  futureAppreciation: number;
  builderTrustRating: number;
  whyRecommended: string;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  location: string;
  price: number; // in INR
  type: "Apartment" | "Villa" | "Plot" | "Commercial";
  bhk: number;
  area: string;
  possession: "Ready" | "Under Construction";
  investmentType: "Capital Appreciation" | "High-Yield Rental" | "Generational Estate";
  description: string;
  architect: string;
  amenities: string[];
  image: string;
  scores: LuxuryScore;
  featured: boolean;
  // Extended editable fields
  reraNumber?: string;
  possessionDate?: string;      // e.g. "Dec 2027" or "Ready to Move"
  nearby?: NearbyAmenities;
  aqi?: AQIData;
  floorPlans?: FloorPlan[];  // custom pricing table rows
  projectName?: string;
  images?: string[];
  recommendationReport?: RecommendationReport;
  udsPerAcre?: number;
  brochureUrl?: string;
  areaUnit?: string;
  plotSize?: number;
  plotSizeUnit?: string;
}

// Known Hyderabad micro-market names used to normalize free-form neighbourhood
// strings (e.g. "Kokapet Elite Cliffs" → "Kokapet") for filters and suggestions.
export const KNOWN_AREAS = [
  "Kokapet",
  "Jubilee Hills",
  "Banjara Hills",
  "Financial District",
  "Narsingi",
  "Tellapur",
  "Gandipet",
  "Madhapur",
  "Gachibowli",
  "Hitec City",
  "Kondapur",
  "Gopanpally",
  "Kollur",
  "Miyapur",
];

export const areaOf = (location: string): string => {
  const neighbourhood = location.split(",")[0].trim();
  return (
    KNOWN_AREAS.find((a) => neighbourhood.toLowerCase().includes(a.toLowerCase())) || neighbourhood
  );
};


export const properties: Property[] = [
  {
    id: "prop-1",
    title: "The Kokapet Summit Villa",
    slug: "kokapet-summit-villa",
    location: "Kokapet Elite Cliffs, Hyderabad",
    price: 142000000, // ₹14.2 Cr
    type: "Villa",
    bhk: 5,
    area: "8,400 sq ft",
    possession: "Ready",
    investmentType: "Capital Appreciation",
    description: "An architectural marvel anchored on Kokapet's highest point. Designed with high-strength structural cantilevered concrete slabs, double-height ceiling voids, and massive floor-to-ceiling retractable glass facades that overlook Hyderabad's growing financial skyline.",
    architect: "Studio Kengo Kuma & Reputed Partners",
    amenities: ["Private Infinity Lap Pool", "Retractable Glass Walls", "Private Elevators", "Tier 3 (Elite) Automation", "24/7 Monitored Security"],
    image: "/images/hero_modernist_villa.png",
    scores: {
      architecturalIntegrity: 98,
      investmentYield: 8.7,
      spatialEfficiency: 95,
      automationTier: "Tier 3 (Elite)"
    },
    featured: true
  },
  {
    id: "prop-2",
    title: "The Jubilee Ridge Pavilion",
    slug: "jubilee-ridge-pavilion",
    location: "Jubilee Hills Road No. 36, Hyderabad",
    price: 85000000, // ₹8.5 Cr
    type: "Commercial",
    bhk: 4,
    area: "6,200 sq ft",
    possession: "Under Construction",
    investmentType: "Generational Estate",
    description: "Conceived as an urban forest sanctuary on a private Jubilee Hills ridge. Integrates raw dark textured granite walls with structural black steel framing. Features massive glass bays that merge the living spaces with Hyderabad's lush green canopies.",
    architect: "Sanjay Puri Architects & Reputed Studios",
    amenities: ["Outdoor Heated Pool", "Subterranean Wine Cellar", "Forest Courtyard Views", "Thermal Climate Grids", "Geothermal Cooling"],
    image: "/images/obsidian_pavilion.png",
    scores: {
      architecturalIntegrity: 96,
      investmentYield: 7.2,
      spatialEfficiency: 92,
      automationTier: "Tier 3 (Elite)"
    },
    featured: true
  },
  {
    id: "prop-3",
    title: "The Hitec Skyline Penthouse",
    slug: "hitec-skyline-penthouse",
    location: "Hitec City Heights, Hyderabad",
    price: 185000000, // ₹18.5 Cr
    type: "Apartment",
    bhk: 3,
    area: "4,800 sq ft",
    possession: "Ready",
    investmentType: "High-Yield Rental",
    description: "Rising 45 stories above Hyderabad's primary tech corridor, this custom-curated penthouse utilizes custom-carved Italian travertine columns, floating ceilings, and panoramic double-height glass panels with 360-degree city views.",
    architect: "Studio Mumbai & Reputed Designers",
    amenities: ["360 Skyline Views", "Private Biometric Elevator", "Wellness Steam Spa", "White Glove Concierge", "Integrated Media Hub"],
    image: "/images/vanguard_penthouse.png",
    scores: {
      architecturalIntegrity: 95,
      investmentYield: 9.4,
      spatialEfficiency: 97,
      automationTier: "Tier 2 (Pro)"
    },
    featured: true
  },
  {
    id: "prop-4",
    title: "The Financial District Monolith",
    slug: "financial-district-monolith",
    location: "Financial District Corridor, Hyderabad",
    price: 260000000, // ₹26.0 Cr
    type: "Plot",
    bhk: 6,
    area: "12,400 sq ft",
    possession: "Ready",
    investmentType: "Generational Estate",
    description: "An extraordinary high-yield estate featuring white sculptural marble facades, private saltwater lagoons, and a dedicated rooftop helipad. Designed for absolute structural permanence and high-end security parameters.",
    architect: "Zaha Hadid Architects & Reputed Developers",
    amenities: ["Private Rooftop Helipad", "Lush Lagoon Gardens", "360 Rooftop Lounge", "Smart Contract Secured", "Sub-terranean Garage"],
    image: "/images/hero_modernist_villa.png",
    scores: {
      architecturalIntegrity: 99,
      investmentYield: 6.9,
      spatialEfficiency: 94,
      automationTier: "Tier 3 (Elite)"
    },
    featured: true
  },
  {
    id: "prop-5",
    title: "The Kondapur Canopy Villa",
    slug: "kondapur-canopy-villa",
    location: "Kondapur Forest Dept Colony, Hyderabad",
    price: 42000000, // ₹4.2 Cr
    type: "Villa",
    bhk: 4,
    area: "5,500 sq ft",
    possession: "Ready",
    investmentType: "Capital Appreciation",
    description: "Nestled quietly adjacent to Kondapur's pristine forest reserve and behind AMB Mall, this modern tropical villa features sand-textured concrete structures, courtyard pathways, and custom teak sliding glass panels.",
    architect: "Anupama Kundoo & Reputed Studios",
    amenities: ["Teak Sliding Facades", "Lush Courtyard Pathways", "Infinity Lap Pool", "Smart-Grid Lighting", "Custom Water Gardens"],
    image: "/images/obsidian_pavilion.png",
    scores: {
      architecturalIntegrity: 94,
      investmentYield: 8.9,
      spatialEfficiency: 96,
      automationTier: "Tier 2 (Pro)"
    },
    featured: false
  },
  {
    id: "prop-6",
    title: "The Gandipet Lakeside Villa",
    slug: "gandipet-lakeside-villa",
    location: "Gandipet Lake Vista, Hyderabad",
    price: 115000000, // ₹11.5 Cr
    type: "Plot",
    bhk: 5,
    area: "7,800 sq ft",
    possession: "Under Construction",
    investmentType: "High-Yield Rental",
    description: "Positioned directly on Hyderabad's Gandipet lakeside, this estate integrates high-end thermo-active local granite. Includes a private thermal wellness cave, subterranean wine cellar, and outdoor lake-view deck.",
    architect: "B.V. Doshi Associates & Reputed Curators",
    amenities: ["Lakefront Deck", "Subterranean Cellar", "Thermal Wellness Cave", "Biometric Access Control", "Frictionless Automated Security"],
    image: "/images/vanguard_penthouse.png",
    scores: {
      architecturalIntegrity: 97,
      investmentYield: 8.2,
      spatialEfficiency: 91,
      automationTier: "Tier 3 (Elite)"
    },
    featured: false
  },
  {
    id: "prop-7",
    title: "The Narsingi Sky Residency",
    slug: "narsingi-sky-residency",
    location: "Narsingi Suburbs, Hyderabad",
    price: 52000000, // ₹5.2 Cr
    type: "Apartment",
    bhk: 4,
    area: "4,600 sq ft",
    possession: "Under Construction",
    investmentType: "High-Yield Rental",
    description: "Rising elegantly over Narsingi's residential skyline, this high-end penthouse features continuous glass balconies, marble floors, and dedicated workspace enclaves.",
    architect: "Morphogenesis & Reputed Builders",
    amenities: ["Continuous Glass Balconies", "Rooftop Yoga Deck", "Private Biometric Elevator", "Smart Contract Secured", "Frictionless Automated Security"],
    image: "/images/hyderabad_luxury_towers.png",
    scores: {
      architecturalIntegrity: 93,
      investmentYield: 8.5,
      spatialEfficiency: 94,
      automationTier: "Tier 2 (Pro)"
    },
    featured: false
  },
  {
    id: "prop-8",
    title: "The Kokapet Glass Citadel",
    slug: "kokapet-glass-citadel",
    location: "Kokapet Cliffs, Hyderabad",
    price: 185000000, // ₹18.5 Cr
    type: "Plot",
    bhk: 5,
    area: "9,600 sq ft",
    possession: "Ready",
    investmentType: "Capital Appreciation",
    description: "A monumental high-rise estate utilizing custom structural steel frames and double-insulated glass panels. Offers panoramic sunset views over the Outer Ring Road (ORR) corridor.",
    architect: "Studio Kengo Kuma & Reputed Partners",
    amenities: ["ORR Panoramic Views", "Private Sky Pool", "Bespoke Automation Systems", "Tier 3 (Elite) Automation", "24/7 Monitored Security"],
    image: "/images/hyderabad_skyline_facade.png",
    scores: {
      architecturalIntegrity: 98,
      investmentYield: 9.1,
      spatialEfficiency: 96,
      automationTier: "Tier 3 (Elite)"
    },
    featured: false
  },
  {
    id: "prop-9",
    title: "The Gachibowli Linear Penthouse",
    slug: "gachibowli-linear-penthouse",
    location: "Gachibowli Heights, Hyderabad",
    price: 48000000, // ₹4.8 Cr
    type: "Apartment",
    bhk: 3,
    area: "3,800 sq ft",
    possession: "Ready",
    investmentType: "High-Yield Rental",
    description: "A premium minimalist penthouse designed for tech leaders. Features linear concrete facades, private terrace gardens, and integrated voice-activated automation.",
    architect: "Sanjay Puri Architects & Reputed Studios",
    amenities: ["Private Terrace Gardens", "Voice Automation Hub", "Italian Marble Bathrooms", "Wellness Steam Spa", "24/7 Monitored Security"],
    image: "/images/vanguard_penthouse.png",
    scores: {
      architecturalIntegrity: 94,
      investmentYield: 8.8,
      spatialEfficiency: 95,
      automationTier: "Tier 2 (Pro)"
    },
    featured: false
  },
  {
    id: "prop-10",
    title: "The Tellapur Green Sanctuary",
    slug: "tellapur-green-sanctuary",
    location: "Tellapur Greenfields, Hyderabad",
    price: 38000000, // ₹3.8 Cr
    type: "Villa",
    bhk: 4,
    area: "4,200 sq ft",
    possession: "Under Construction",
    investmentType: "Generational Estate",
    description: "A sustainable luxury villa utilizing raw exposed bricks and solar roof structures. Placed in Tellapur's most premium low-density villa layout.",
    architect: "Anupama Kundoo & Reputed Studios",
    amenities: ["Exposed Brick Facade", "Solar Micro-Grid", "Forest Walkways Access", "Smart-Grid Lighting", "Custom Water Gardens"],
    image: "/images/obsidian_pavilion.png",
    scores: {
      architecturalIntegrity: 95,
      investmentYield: 7.6,
      spatialEfficiency: 93,
      automationTier: "Tier 1 (Integrated)"
    },
    featured: false
  },
  {
    id: "prop-11",
    title: "The Gandipet Waterfront Estate",
    slug: "gandipet-waterfront-estate",
    location: "Gandipet Vista, Hyderabad",
    price: 220000000, // ₹22.0 Cr
    type: "Plot",
    bhk: 6,
    area: "14,500 sq ft",
    possession: "Ready",
    investmentType: "Generational Estate",
    description: "An sprawling lakeside estate with massive double-height living halls, private yacht mooring, and bulletproof security systems.",
    architect: "Zaha Hadid Architects & Reputed Developers",
    amenities: ["Private Yacht Mooring", "Double Height Voids", "Private Screening Cinema", "Smart Contract Secured", "Sub-terranean Garage"],
    image: "/images/hero_modernist_villa.png",
    scores: {
      architecturalIntegrity: 99,
      investmentYield: 6.5,
      spatialEfficiency: 97,
      automationTier: "Tier 3 (Elite)"
    },
    featured: false
  },
  {
    id: "prop-12",
    title: "The Jubilee Heights Monolith",
    slug: "jubilee-heights-monolith",
    location: "Jubilee Hills Road No. 10, Hyderabad",
    price: 125000000, // ₹12.5 Cr
    type: "Apartment",
    bhk: 5,
    area: "7,400 sq ft",
    possession: "Under Construction",
    investmentType: "Capital Appreciation",
    description: "A premium structural monolith situated on a Jubilee Hills summit. Features panoramic glass walls, high-yield appreciation rates, and gold-grade security clearance.",
    architect: "B.V. Doshi Associates & Reputed Curators",
    amenities: ["Panoramic Summit Views", "Helipad Access Node", "Italian Marble Bathrooms", "Wellness Steam Spa", "Tier 3 (Elite) Automation"],
    image: "/images/hyderabad_luxury_towers.png",
    scores: {
      architecturalIntegrity: 97,
      investmentYield: 8.4,
      spatialEfficiency: 96,
      automationTier: "Tier 3 (Elite)"
    },
    featured: false
  },
  {
    id: "prop-13",
    title: "The Madhapur Tech Pavilion",
    slug: "madhapur-tech-pavilion",
    location: "Madhapur Core, Hyderabad",
    price: 65000000, // ₹6.5 Cr
    type: "Commercial",
    bhk: 4,
    area: "5,800 sq ft",
    possession: "Ready",
    investmentType: "High-Yield Rental",
    description: "Designed for premium tech professionals. A custom-sculpted pavilion featuring double-height retracting glass walls, smart solar grids, and biometric access codes.",
    architect: "Morphogenesis & Reputed Builders",
    amenities: ["Rooftop Solar Grids", "Biometric Access Codes", "Linear Concrete Facade", "Smart Contract Secured", "Sub-terranean Garage"],
    image: "/images/hyderabad_skyline_facade.png",
    scores: {
      architecturalIntegrity: 94,
      investmentYield: 9.3,
      spatialEfficiency: 95,
      automationTier: "Tier 2 (Pro)"
    },
    featured: false
  },
  {
    id: "prop-14",
    title: "The Kokapet Aqua Mansion",
    slug: "kokapet-aqua-mansion",
    location: "Kokapet Cliffs, Hyderabad",
    price: 158000000, // ₹15.8 Cr
    type: "Villa",
    bhk: 5,
    area: "8,900 sq ft",
    possession: "Ready",
    investmentType: "Capital Appreciation",
    description: "An elite architectural masterpiece built with structural concrete slabs, custom waterfall panels, and direct vertical elevators overlooking the lake.",
    architect: "Studio Mumbai & Reputed Designers",
    amenities: ["Custom Water Panels", "Direct Lake Elevators", "Infinity Edge Lap Pool", "Teak Sliding Facades", "Smart-Grid Lighting"],
    image: "/images/hero_modernist_villa.png",
    scores: {
      architecturalIntegrity: 98,
      investmentYield: 8.6,
      spatialEfficiency: 96,
      automationTier: "Tier 3 (Elite)"
    },
    featured: false
  },
  {
    id: "prop-15",
    title: "The Gachibowli Horizon Suites",
    slug: "gachibowli-horizon-suites",
    location: "Gachibowli Heights, Hyderabad",
    price: 55000000, // ₹5.5 Cr
    type: "Apartment",
    bhk: 3,
    area: "4,100 sq ft",
    possession: "Under Construction",
    investmentType: "High-Yield Rental",
    description: "A luxury high-rise penthouse situated inside Gachibowli's premier residential tower. Integrates customized glass paneling and smart vertical garden balconies.",
    architect: "Sanjay Puri Architects & Reputed Studios",
    amenities: ["Vertical Garden Balcony", "Rooftop Yoga Deck", "Private Biometric Elevator", "White Glove Concierge", "Thermal Climate Grids"],
    image: "/images/vanguard_penthouse.png",
    scores: {
      architecturalIntegrity: 95,
      investmentYield: 8.9,
      spatialEfficiency: 94,
      automationTier: "Tier 2 (Pro)"
    },
    featured: false
  },
  {
    id: "prop-16",
    title: "The Financial District Pinnacle",
    slug: "financial-district-pinnacle",
    location: "Financial District, Hyderabad",
    price: 285000000, // ₹28.5 Cr
    type: "Plot",
    bhk: 6,
    area: "15,800 sq ft",
    possession: "Ready",
    investmentType: "Generational Estate",
    description: "The absolute crown jewel of the Financial District corridor. An ultra-premium structural estate featuring private heli-pads, multi-layer security grids, and private lakes.",
    architect: "Zaha Hadid Architects & Reputed Developers",
    amenities: ["Rooftop Helicopter Pad", "Private Saltwater Lake", "Private Movie Screening", "Sub-terranean Garage", "Tier 3 (Elite) Automation"],
    image: "/images/hyderabad_luxury_towers.png",
    scores: {
      architecturalIntegrity: 99,
      investmentYield: 6.8,
      spatialEfficiency: 97,
      automationTier: "Tier 3 (Elite)"
    },
    featured: false
  },
  {
    id: "prop-17",
    title: "The Narsingi Oasis Pavilion",
    slug: "narsingi-oasis-pavilion",
    location: "Narsingi Suburbs, Hyderabad",
    price: 42000000, // ₹4.2 Cr
    type: "Commercial",
    bhk: 4,
    area: "5,100 sq ft",
    possession: "Ready",
    investmentType: "High-Yield Rental",
    description: "A contemporary pavilion featuring sand-textured granite walls, glass bay corridors, and custom water features. Located in Narsingi's private luxury zone.",
    architect: "Anupama Kundoo & Reputed Studios",
    amenities: ["Sand-Textured Granite", "Glass Bay Corridors", "Thermal Climate Grids", "Smart-Grid Lighting", "Custom Water Gardens"],
    image: "/images/obsidian_pavilion.png",
    scores: {
      architecturalIntegrity: 94,
      investmentYield: 8.7,
      spatialEfficiency: 95,
      automationTier: "Tier 2 (Pro)"
    },
    featured: false
  },
  {
    id: "prop-18",
    title: "The Jubilee Hills Sovereign Estate",
    slug: "jubilee-hills-sovereign-estate",
    location: "Jubilee Hills No. 36, Hyderabad",
    price: 240000000, // ₹24.0 Cr
    type: "Plot",
    bhk: 5,
    area: "11,800 sq ft",
    possession: "Under Construction",
    investmentType: "Generational Estate",
    description: "Conceived as a private fortress sanctuary on Hyderabad's most exclusive hill. Features raw split-face stone block facades and seamless floor-to-ceiling glass grids.",
    architect: "B.V. Doshi Associates & Reputed Curators",
    amenities: ["Split-face Stone Facade", "Rooftop Helicopter Pad", "Subterranean Wine Cellar", "Forest Courtyard Views", "Biometric Access Control"],
    image: "/images/hero_modernist_villa.png",
    scores: {
      architecturalIntegrity: 99,
      investmentYield: 7.1,
      spatialEfficiency: 95,
      automationTier: "Tier 3 (Elite)"
    },
    featured: false
  },
  {
    id: "prop-19",
    title: "The Tellapur Grand Villa",
    slug: "tellapur-grand-villa",
    location: "Tellapur, Hyderabad",
    price: 49000000, // ₹4.9 Cr
    type: "Villa",
    bhk: 4,
    area: "6,000 sq ft",
    possession: "Ready",
    investmentType: "Capital Appreciation",
    description: "An elegant modernist villa situated inside Tellapur's high-growth residential zone. Integrates warm teak wood facades, infinity lap pools, and automated thermal sensors.",
    architect: "Morphogenesis & Reputed Builders",
    amenities: ["Teak Wood Sliding Facades", "Infinity Edge Pool", "Smart-Grid Lighting", "RERA Pre-Verified", "24/7 Monitored Security"],
    image: "/images/obsidian_pavilion.png",
    scores: {
      architecturalIntegrity: 95,
      investmentYield: 8.5,
      spatialEfficiency: 96,
      automationTier: "Tier 2 (Pro)"
    },
    featured: false
  },
  {
    id: "prop-20",
    title: "The Gandipet Cloud Penthouse",
    slug: "gandipet-cloud-penthouse",
    location: "Gandipet Lake Vista, Hyderabad",
    price: 82000000, // ₹8.2 Cr
    type: "Apartment",
    bhk: 4,
    area: "6,500 sq ft",
    possession: "Ready",
    investmentType: "High-Yield Rental",
    description: "Overlooking the entire Gandipet lake expanse, this sky-high penthouse features floor-to-ceiling glass structural shells, smart thermal zoning, and private elevator locks.",
    architect: "Studio Mumbai & Reputed Designers",
    amenities: ["Lakeside Horizon Views", "Private Biometric Elevator", "wellness Steam Spa", "Frictionless Automated Security", "Tier 3 (Elite) Automation"],
    image: "/images/hyderabad_skyline_facade.png",
    scores: {
      architecturalIntegrity: 96,
      investmentYield: 9.2,
      spatialEfficiency: 94,
      automationTier: "Tier 3 (Elite)"
    },
    featured: false
  },
  {
    id: "prop-21",
    title: "The Madhapur Crest Pavilion",
    slug: "madhapur-crest-pavilion",
    location: "Madhapur Node, Hyderabad",
    price: 58000000, // ₹5.8 Cr
    type: "Commercial",
    bhk: 3,
    area: "4,900 sq ft",
    possession: "Under Construction",
    investmentType: "High-Yield Rental",
    description: "Designed for premium remote professionals. Features linear concrete slabs, integrated solar microgrids, and custom soundproof glass pods.",
    architect: "Sanjay Puri Architects & Reputed Studios",
    amenities: ["Soundproof Glass Pods", "Rooftop Solar Grids", "Biometric Access Codes", "Smart-Grid Lighting", "Custom Water Gardens"],
    image: "/images/vanguard_penthouse.png",
    scores: {
      architecturalIntegrity: 94,
      investmentYield: 9.0,
      spatialEfficiency: 95,
      automationTier: "Tier 2 (Pro)"
    },
    featured: false
  },
  {
    id: "prop-22",
    title: "The Kokapet Cliffside Pavilion",
    slug: "kokapet-cliffside-pavilion",
    location: "Kokapet Cliffs, Hyderabad",
    price: 95000000, // ₹9.5 Cr
    type: "Commercial",
    bhk: 4,
    area: "6,900 sq ft",
    possession: "Ready",
    investmentType: "Capital Appreciation",
    description: "Perched dramatically on Kokapet's cliffs, this pavilion offers massive wrap-around balconies and double-insulated reflective glass panes.",
    architect: "Studio Kengo Kuma & Reputed Partners",
    amenities: ["Wrap-Around Balcony", "Double Insulated Glass", "Infinity Lap Pool", "Smart Contract Secured", "Sub-terranean Garage"],
    image: "/images/hyderabad_luxury_towers.png",
    scores: {
      architecturalIntegrity: 97,
      investmentYield: 8.8,
      spatialEfficiency: 93,
      automationTier: "Tier 3 (Elite)"
    },
    featured: false
  },
  {
    id: "prop-23",
    title: "The Narsingi Courtyard Villa",
    slug: "narsingi-courtyard-villa",
    location: "Narsingi, Hyderabad",
    price: 39000000, // ₹3.9 Cr
    type: "Villa",
    bhk: 4,
    area: "4,800 sq ft",
    possession: "Ready",
    investmentType: "Capital Appreciation",
    description: "Features a beautiful centralized courtyard, customized teakwood screen partitions, and integrated rain-water harvesting systems.",
    architect: "Anupama Kundoo & Reputed Studios",
    amenities: ["Central Courtyard Garden", "Teak Screen Partitions", "Rainwater Harvesting", "Smart-Grid Lighting", "24/7 Monitored Security"],
    image: "/images/obsidian_pavilion.png",
    scores: {
      architecturalIntegrity: 94,
      investmentYield: 8.3,
      spatialEfficiency: 96,
      automationTier: "Tier 1 (Integrated)"
    },
    featured: false
  },
  {
    id: "prop-24",
    title: "The Financial District Glasshouse",
    slug: "financial-district-glasshouse",
    location: "Financial District Corridor, Hyderabad",
    price: 192000000, // ₹19.2 Cr
    type: "Plot",
    bhk: 5,
    area: "10,200 sq ft",
    possession: "Under Construction",
    investmentType: "Generational Estate",
    description: "An extraordinary modern masterpiece utilizing vertical green wall grids, customized double glass panel insulation, and integrated geothermal climate corridors.",
    architect: "Zaha Hadid Architects & Reputed Developers",
    amenities: ["Geothermal Climate Grids", "Vertical Green Walls", "Rooftop Sky Lounge", "Wellness Steam Spa", "Tier 3 (Elite) Automation"],
    image: "/images/hyderabad_skyline_facade.png",
    scores: {
      architecturalIntegrity: 98,
      investmentYield: 8.1,
      spatialEfficiency: 95,
      automationTier: "Tier 3 (Elite)"
    },
    featured: false
  },
  {
    id: "prop-25",
    title: "The Gachibowli Apex Penthouse",
    slug: "gachibowli-apex-penthouse",
    location: "Gachibowli, Hyderabad",
    price: 69000000, // ₹6.9 Cr
    type: "Apartment",
    bhk: 4,
    area: "5,200 sq ft",
    possession: "Ready",
    investmentType: "High-Yield Rental",
    description: "An impressive dual-level penthouse offering unobstructed vistas of the outer ring road and Financial District skylines. Includes standard rooftop decks and infinity pools.",
    architect: "Morphogenesis & Reputed Builders",
    amenities: ["ORR Skyline Vista", "Rooftop Yoga Deck", "Italian Marble Bathrooms", "Wellness Steam Spa", "Private Biometric Elevator"],
    image: "/images/vanguard_penthouse.png",
    scores: {
      architecturalIntegrity: 96,
      investmentYield: 9.0,
      spatialEfficiency: 96,
      automationTier: "Tier 2 (Pro)"
    },
    featured: false
  },
  {
    id: "prop-26",
    title: "The Tellapur Vista Pavilion",
    slug: "tellapur-vista-pavilion",
    location: "Tellapur Greenfields, Hyderabad",
    price: 51000000, // ₹5.1 Cr
    type: "Commercial",
    bhk: 4,
    area: "5,400 sq ft",
    possession: "Under Construction",
    investmentType: "Capital Appreciation",
    description: "A gorgeous modern structure combining steel frame support beams and massive timber overhangs. Perfectly integrated inside Tellapur's high-end green layouts.",
    architect: "Studio Mumbai & Reputed Designers",
    amenities: ["Steel Timber Frame", "Forest View Terrace", "Thermal Climate Grids", "Smart-Grid Lighting", "Custom Water Gardens"],
    image: "/images/hyderabad_luxury_towers.png",
    scores: {
      architecturalIntegrity: 95,
      investmentYield: 8.4,
      spatialEfficiency: 94,
      automationTier: "Tier 2 (Pro)"
    },
    featured: false
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// getProperties() — reads admin edits from localStorage, falls back to static.
// Use this on all public-facing pages so admin changes are reflected live.
// ─────────────────────────────────────────────────────────────────────────────
export function getProperties(): Property[] {
  if (typeof window === "undefined") return properties;
  try {
    const stored = localStorage.getItem("nexhouz_listings");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return properties;
}

