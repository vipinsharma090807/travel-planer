/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { PlaceData, WeatherData, CountryData } from "@/types";

// API Keys - In production, these should be environment variables
// const FOURSQUARE_API_KEY =
//   process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY || "2JE5JT2ZJCF10RKXU5N3T5UT21SHFCMAYFZMRP2TRXWZ0VWU";
const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "7c97ee59c41fc9095252ee96f1340eee";

/**
 * Fetch places to visit from Foursquare API
 * @param cityName - Name of the city to search for places
 * @returns Promise<PlaceData[]> - Array of places data
 */
export async function getPlacesToVisit(cityName: string): Promise<PlaceData[]> {
  try {
    if (!cityName || cityName.trim() === "") {
      throw new Error("City name is required");
    }

    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=7c97ee59c41fc9095252ee96f1340eee`);
    return response.data;
    // if (!response.data || !response.data.results) {
    //   return [];
    // }

    // Transform the response to match our PlaceData interface
    const places: PlaceData[] = response.data.results.map((place: any) => ({
      fsq_id: place.fsq_id,
      name: place.name,
      categories: place.categories || [],
      location: {
        address: place.location?.address,
        locality: place.location?.locality,
        region: place.location?.region,
        country: place.location?.country,
        formatted_address: place.location?.formatted_address,
      },
      rating: place.rating,
      hours: place.hours ? { display: place.hours.display } : undefined,
    }));

    return places;
  } catch (error) {
    console.error("Error fetching places to visit:", error);

    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        throw new ApiRequestError(
          "Places information temporarily unavailable due to rate limit. Please try again later.",
          429
        );
      }
      if (error.response?.status === 401) {
        throw new ApiRequestError("Unable to access places data. Please check API configuration.", 401);
      }
      if (error.response?.status === 404) {
        throw new ApiRequestError("No places found for this location.", 404);
      }
      if (error.code === "ECONNABORTED") {
        throw new ApiRequestError("Request timed out. Please try again.", 408);
      }
    }

    // Generic error for other cases
    throw new ApiRequestError("Places information temporarily unavailable. Please try again later.");
  }
}

/**
 * Fetch weather data from OpenWeather API
 * @param cityName - Name of the city to get weather for
 * @returns Promise<WeatherData> - Weather data
 */
export async function getWeatherData(cityName: string): Promise<WeatherData> {
  try {
    if (!cityName || cityName.trim() === "") {
      throw new Error("City name is required");
    }

    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        q: cityName.trim(),
        appid: OPENWEATHER_API_KEY,
        units: "metric",
      },
      timeout: 10000,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new ApiRequestError("Weather data not available for this location", 404);
      }
      if (error.response?.status === 401) {
        throw new ApiRequestError("Unable to access weather data. Please check API configuration.", 401);
      }
      if (error.code === "ECONNABORTED") {
        throw new ApiRequestError("Request timed out. Please try again.", 408);
      }
    }

    throw new ApiRequestError("Unable to fetch weather data. Please try again later.");
  }
}

/**
 * Fetch country data from RestCountries API
 * @param countryName - Name of the country to get information for
 * @returns Promise<CountryData> - Country data
 */
export async function getCountryData(countryName: string,exactSearch:boolean=false): Promise<CountryData> {
  try {
    if (!countryName || countryName.trim() === "") {
      throw new Error("Country name is required");
    }

    const response = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName.trim())}?fullText=${exactSearch}`, {
      timeout: 10000,
    });

    if (!response.data || response.data.length === 0) {
      throw new Error("Country not found");
    }

    // Return the first match
    return response.data[0];
  } catch (error) {
    console.error("Error fetching country data:", error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new ApiRequestError("Country information not found", 404);
      }
      if (error.code === "ECONNABORTED") {
        throw new ApiRequestError("Request timed out. Please try again.", 408);
      }
    }

    throw new ApiRequestError("Unable to fetch country information. Please try again later.");
  }
}



// Custom error class for API errors
export class ApiRequestError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}
