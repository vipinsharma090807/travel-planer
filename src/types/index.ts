export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure?: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg?: number;
  };
  sys: {
    country: string;
    sunrise?: number;
    sunset?: number;
  };
  visibility?: number;
  clouds?: {
    all: number;
  };
}

export interface CountryData {
  name: {
    common: string;
    official: string;
  };
  flags: {
    png: string;
    svg: string;
  };
  capital: string[];
  population: number;
  region: string;
  currencies: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
}

// Comprehensive Country interface for REST Countries API
export interface Country {
  name: {
    common: string;
    official: string;
    nativeName?: {
      [key: string]: {
        official: string;
        common: string;
      };
    };
  };
  tld?: string[];
  cca2: string;
  ccn3?: string;
  cca3: string;
  cioc?: string;
  independent?: boolean;
  status: string;
  unMember?: boolean;
  currencies?: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
  idd?: {
    root: string;
    suffixes: string[];
  };
  capital?: string[];
  altSpellings?: string[];
  region: string;
  subregion?: string;
  languages?: {
    [key: string]: string;
  };
  latlng?: number[];
  landlocked?: boolean;
  borders?: string[];
  area?: number;
  demonyms?: {
    [key: string]: {
      f: string;
      m: string;
    };
  };
  flag: string;
  maps?: {
    googleMaps: string;
    openStreetMaps: string;
  };
  population: number;
  gini?: {
    [key: string]: number;
  };
  fifa?: string;
  car?: {
    signs: string[];
    side: string;
  };
  timezones?: string[];
  continents?: string[];
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  coatOfArms?: {
    png: string;
    svg: string;
  };
  startOfWeek?: string;
  capitalInfo?: {
    latlng: number[];
  };
  postalCode?: {
    format: string;
    regex: string;
  };
  translations?: {
    [key: string]: {
      official: string;
      common: string;
    };
  };
}

export interface PlaceData {
  fsq_id: string;
  name: string;
  categories: Array<{
    id: number;
    name: string;
    icon: {
      prefix: string;
      suffix: string;
    };
  }>;
  location: {
    address?: string;
    locality?: string;
    region?: string;
    country?: string;
    formatted_address?: string;
  };
  rating?: number;
  hours?: {
    display: string;
  };
}

export interface SavedCity {
  name: string;
  weather: WeatherData;
  country: CountryData;
  places: PlaceData[];
}

export interface SearchFormData {
  cityName: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
