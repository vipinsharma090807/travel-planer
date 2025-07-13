/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCloud,
  // FaSun,
  FaWind,
  FaTint,
  FaRegClock,
} from 'react-icons/fa';
import { getPlacesToVisit } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import Image from 'next/image';

// Helper to convert Kelvin to Celsius
function kelvinToCelsius(kelvin: number): string {
  return (kelvin - 273.15).toFixed(1);
}

// Helper to get weather icon URL from OpenWeatherMap
function getWeatherIcon(icon: string) {
  return `https://openweathermap.org/img/wn/${icon}@4x.png`;
}

export default function WeatherCardPage() {
  const params = useParams();
  const [weather, setWeather] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const cityName = params.state ? decodeURIComponent(params.state as string) : '';
  const countryName = params.cityName ? decodeURIComponent(params.cityName as string) : '';

  useEffect(() => {
    const fetchWeather = async () => {
      if (!cityName) return;

      setIsLoading(true);
      setError('');

      try {
        const weatherData = await getPlacesToVisit(cityName);
        setWeather(weatherData);
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError(err instanceof Error ? err.message : 'Failed to load weather data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [cityName]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-lg text-gray-600 mt-4">Loading weather for {cityName}...</p>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <ErrorMessage message={error || "Weather data not available."} />
          <div className="mt-6 text-center">
            <Link
              href={`/city/${params.cityName}/state/${params.state}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Weather data destructuring
  const {
    name,
    sys,
    weather: weatherArr,
    main,
    wind,
    clouds,
  } = weather;

  const weatherMain = weatherArr && weatherArr[0] ? weatherArr[0] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-md bg-white/90 rounded-3xl shadow-2xl p-8 border border-blue-100 relative">
          <Link
            href={`/city/${params.cityName}/state/${params.state}`}
            className="absolute left-4 top-4 text-blue-600 hover:text-blue-800 flex items-center"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </Link>
          <div className="flex flex-col items-center mt-6">
            {/* City & Country */}
            <h1 className="text-3xl font-bold text-gray-900 mb-1 text-center">
              {name}
            </h1>
            <div className="flex items-center text-gray-600 mb-4">
              <FaMapMarkerAlt className="mr-1" />
              <span className="font-medium">{countryName}{sys?.country ? `, ${sys.country}` : ''}</span>
            </div>
            {/* Weather Icon */}
            {weatherMain && (
              <Image
                height={100}
                width={100}
                src={getWeatherIcon(weatherMain.icon)}
                alt={weatherMain.description}
                className="w-32 h-32 mb-2"
                style={{ filter: 'drop-shadow(0 4px 16px #60a5fa55)' }}
              />
            )}
            {/* Weather Main */}
            <div className="text-2xl font-semibold text-blue-700 mb-2 capitalize">
              {weatherMain?.main}
              {weatherMain?.description ? ` - ${weatherMain.description}` : ''}
            </div>
            {/* Temperature */}
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="flex flex-col items-center">
                <span className="text-5xl font-bold text-gray-900">
                  {main ? kelvinToCelsius(main.temp) : '--'}°C
                </span>
                <span className="text-xs text-gray-500">Temperature</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg text-gray-700">
                  Feels like {main ? kelvinToCelsius(main.feels_like) : '--'}°C
                </span>
                <span className="text-xs text-gray-500">Feels Like</span>
              </div>
            </div>
            {/* Weather Details */}
            <div className="grid grid-cols-2 gap-4 w-full mt-4">
              <div className="flex items-center gap-2">
                <FaTint className="text-blue-400" />
                <span className="font-medium">{main?.humidity ?? '--'}%</span>
                <span className="text-xs text-gray-500">Humidity</span>
              </div>
              <div className="flex items-center gap-2">
                <FaWind className="text-blue-400" />
                <span className="font-medium">{wind?.speed ?? '--'} m/s</span>
                <span className="text-xs text-gray-500">Wind</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCloud className="text-blue-400" />
                <span className="font-medium">{clouds?.all ?? '--'}%</span>
                <span className="text-xs text-gray-500">Cloudiness</span>
              </div>
              <div className="flex items-center gap-2">
                <FaRegClock className="text-blue-400" />
                <span className="font-medium">{weather?.visibility ? `${weather.visibility / 1000} km` : '--'}</span>
                <span className="text-xs text-gray-500">Visibility</span>
              </div>
            </div>
            {/* Min/Max Temp */}
            <div className="flex justify-between w-full mt-6">
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-500">Min</span>
                <span className="font-semibold text-blue-600">{main ? kelvinToCelsius(main.temp_min) : '--'}°C</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-500">Max</span>
                <span className="font-semibold text-blue-600">{main ? kelvinToCelsius(main.temp_max) : '--'}°C</span>
              </div>
            </div>
            {/* Pressure */}
            <div className="flex justify-center mt-4">
              <span className="text-xs text-gray-500">
                Pressure: <span className="font-medium text-gray-700">{main?.pressure ?? '--'} hPa</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}