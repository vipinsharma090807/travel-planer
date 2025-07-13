"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  FaArrowLeft,
  FaSpinner,
  // FaThermometerHalf,
  FaEye,
  FaTint,
  FaWind,
  FaCompass,
  FaChartBar,
  FaCloudSun,
  FaBookmark,
  FaSave,
  FaCheck,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaGlobe,
} from "react-icons/fa";
import { getWeatherData, getCountryData, getPlacesToVisit } from "@/lib/api";
import { WeatherData, CountryData, PlaceData } from "@/types";
import { useTravelPlannerStore } from "@/store";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

export default function WeatherPage() {
  const params = useParams();
  const { addSavedCity, isCitySaved } = useTravelPlannerStore();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [country, setCountry] = useState<CountryData | null>(null);
  const [places, setPlaces] = useState<PlaceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const cityName = params.state ? decodeURIComponent(params.state as string) : "";
  const countryName = params.cityName ? decodeURIComponent(params.cityName as string) : "";
  const isAlreadySaved = isCitySaved(cityName);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!cityName) return;

      setIsLoading(true);
      setError("");

      try {
        // Fetch weather data first
        const weatherData = await getWeatherData(cityName);
        setWeather(weatherData);

        console.log("weatherData", weatherData);

        // Fetch country data and places in parallel
        const [countryData, placesData] = await Promise.allSettled([
          getCountryData(countryName, true),
          getPlacesToVisit(cityName),
        ]);

        if (countryData.status === "fulfilled") {
          console.log("countryData", countryData.value);
          setCountry(countryData.value);
        }

        if (placesData.status === "fulfilled") {
          setPlaces(placesData.value);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to load weather data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [cityName]);

  const handleSaveCity = async () => {
    if (!weather || !country) return;

    setIsSaving(true);
    try {
      addSavedCity({
        name: cityName,
        weather,
        country,
        places,
      });
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 3000);
    } catch (error) {
      console.error("Error saving city:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getWindDirection = (degree: number) => {
    const directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ];
    return directions[Math.round(degree / 22.5) % 16];
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-lg text-gray-600 mt-4">Loading weather data for {cityName}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <ErrorMessage message={error} />
          <div className="mt-6 text-center">
            <Link
              href={`/city/${params.cityName}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <FaArrowLeft className="mr-2" />
              Back to Cities
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-4xl text-amber-500 mb-4" />
          <p className="text-lg text-gray-600">No weather data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/city/${params.cityName}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to {countryName}
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{cityName}</h1>
              <p className="text-gray-600 flex items-center">
                <FaMapMarkerAlt className="mr-1" />
                {weather.sys.country}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Weather Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Image
                    src={getWeatherIcon(weather.weather[0].icon)}
                    alt={weather.weather[0].description}
                    width={80}
                    height={80}
                    className="drop-shadow-lg"
                  />
                  <div>
                    <div className="text-5xl font-bold text-gray-900">{Math.round(weather.main.temp)}°C</div>
                    <div className="text-gray-600 capitalize text-lg">{weather.weather[0].description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Feels like</div>
                  <div className="text-2xl font-semibold text-gray-700">{Math.round(weather.main.feels_like)}°C</div>
                </div>
              </div>

              {/* Weather Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <FaTint className="text-blue-600 text-2xl mb-2 mx-auto" />
                  <div className="text-sm text-gray-600">Humidity</div>
                  <div className="text-xl font-semibold">{weather.main.humidity}%</div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <FaWind className="text-green-600 text-2xl mb-2 mx-auto" />
                  <div className="text-sm text-gray-600">Wind Speed</div>
                  <div className="text-xl font-semibold">{weather.wind.speed} m/s</div>
                </div>

                {weather.wind.deg && (
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <FaCompass className="text-purple-600 text-2xl mb-2 mx-auto" />
                    <div className="text-sm text-gray-600">Wind Direction</div>
                    <div className="text-xl font-semibold">{getWindDirection(weather.wind.deg)}</div>
                  </div>
                )}

                {weather.main.pressure && (
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <FaChartBar className="text-orange-600 text-2xl mb-2 mx-auto" />
                    <div className="text-sm text-gray-600">Pressure</div>
                    <div className="text-xl font-semibold">{weather.main.pressure} hPa</div>
                  </div>
                )}
              </div>

              {/* Additional Weather Info */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {weather.visibility && (
                  <div className="flex items-center gap-3">
                    <FaEye className="text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600">Visibility</div>
                      <div className="font-semibold">{(weather.visibility / 1000).toFixed(1)} km</div>
                    </div>
                  </div>
                )}

                {weather.clouds && (
                  <div className="flex items-center gap-3">
                    <FaCloudSun className="text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600">Cloudiness</div>
                      <div className="font-semibold">{weather.clouds.all}%</div>
                    </div>
                  </div>
                )}

                {weather.sys.sunrise && (
                  <div className="flex items-center gap-3">
                    <div className="text-yellow-500">🌅</div>
                    <div>
                      <div className="text-sm text-gray-600">Sunrise</div>
                      <div className="font-semibold">{formatTime(weather.sys.sunrise)}</div>
                    </div>
                  </div>
                )}

                {weather.sys.sunset && (
                  <div className="flex items-center gap-3">
                    <div className="text-orange-500">🌇</div>
                    <div>
                      <div className="text-sm text-gray-600">Sunset</div>
                      <div className="font-semibold">{formatTime(weather.sys.sunset)}</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSaveCity}
                  disabled={isSaving || isAlreadySaved}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    isAlreadySaved
                      ? "bg-green-100 text-green-700 cursor-not-allowed"
                      : justSaved
                      ? "bg-green-600 text-white"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isSaving ? (
                    <FaSpinner className="animate-spin" />
                  ) : isAlreadySaved ? (
                    <FaCheck />
                  ) : justSaved ? (
                    <FaCheck />
                  ) : (
                    <FaSave />
                  )}
                  {isAlreadySaved ? "Saved" : justSaved ? "Saved!" : "Save City"}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Country Information */}
            {country && (
              <div className="bg-white rounded-xl shadow-lg p-6 text-black">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FaGlobe className="text-blue-600" />
                  Country Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={country.flags.svg}
                      alt={`${country.name.common} flag`}
                      width={40}
                      height={30}
                      className="rounded border"
                    />
                    <div>
                      <div className="font-semibold text-black">{countryName}</div>
                      <div className="text-sm text-gray-600">{cityName}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Capital</div>
                      <div className="font-semibold">{country.capital?.[0] || "N/A"}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Region</div>
                      <div className="font-semibold">{country.region}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Population</div>
                      <div className="font-semibold">{country.population.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Currency</div>
                      <div className="font-semibold">
                        {country.currencies ? Object.values(country.currencies)[0]?.name : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Places to Visit Preview */}
            {places.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-600" />
                  Popular Places
                </h3>
                <div className="space-y-3">
                  {places.slice(0, 3).map((place) => (
                    <div key={place.fsq_id} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                      <div className="font-medium text-gray-900">{place.name}</div>
                      <div className="text-sm text-gray-600">{place.categories[0]?.name || "Attraction"}</div>
                      {place.location.formatted_address && (
                        <div className="text-xs text-gray-500 mt-1">{place.location.formatted_address}</div>
                      )}
                    </div>
                  ))}
                </div>

                {places.length > 3 && (
                  <Link
                    href={`/city/${params.cityName}/state/${params.state}/places`}
                    className="block mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View all {places.length} places →
                  </Link>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/dashboard"
                  className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaBookmark className="inline mr-2" />
                  View Dashboard
                </Link>

                <Link
                  href="/"
                  className="block w-full bg-gray-200 text-gray-700 text-center py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Search New City
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
