'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaArrowLeft,
  FaTrash,
  FaThermometerHalf,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaSpinner,
  FaExclamationTriangle
} from 'react-icons/fa';
import { useTravelPlannerStore } from '@/store';
// import { SavedCity } from '@/types';

export default function DashboardPage() {
  const { savedCities, removeSavedCity, clearAllSavedCities } = useTravelPlannerStore();
  console.log('savedCities',savedCities);
  const [removingCityId, setRemovingCityId] = useState<string | null>(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleRemoveCity = async (cityName: string) => {
    setRemovingCityId(cityName);
    try {
      removeSavedCity(cityName);
    } catch (error) {
      console.error('Error removing city:', error);
    } finally {
      setRemovingCityId(null);
    }
  };

  const handleClearAll = () => {
    clearAllSavedCities();
    setShowConfirmClear(false);
  };

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // const formatCurrency = (currencies: SavedCity['country']['currencies']) => {
  //   if (!currencies || Object.keys(currencies).length === 0) return 'N/A';
  //   return Object.values(currencies).map(currency => currency.name).join(', ');
  // };

  if (savedCities.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Search
            </Link>

            <h1 className="text-3xl font-bold text-gray-900">
              My Travel Dashboard
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="mb-6">
              <FaMapMarkerAlt className="text-6xl text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                No Saved Cities Yet
              </h2>
              <p className="text-gray-500 mb-6">
                Start exploring cities around the world and save your favorites here!
              </p>
              <Link
                href="/"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Exploring
              </Link>
            </div>
          </div>
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
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Search
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Travel Dashboard
              </h1>
              <p className="text-gray-600">
                You have {savedCities.length} saved {savedCities.length === 1 ? 'city' : 'cities'}
              </p>
            </div>

            {savedCities.length > 1 && (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="mt-4 sm:mt-0 text-red-600 hover:text-red-800 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {savedCities.map((city) => (
            <div key={city.name} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* City Header */}
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{city.name}</h2>
                  <button
                    onClick={() => handleRemoveCity(city.name)}
                    disabled={removingCityId === city.name}
                    className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                    title="Remove city"
                  >
                    {removingCityId === city.name ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaTrash />
                    )}
                  </button>
                </div>

                {/* Weather Summary */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={getWeatherIcon(city.weather.weather[0].icon)}
                      alt={city.weather.weather[0].description}
                      width={40}
                      height={40}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <FaThermometerHalf className="text-red-500 text-sm" />
                        <span className="font-semibold">
                          {Math.round(city.weather.main.temp)}°C
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 capitalize">
                        {city.weather.weather[0].description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Feels like</p>
                    <p className="font-medium">
                      {Math.round(city.weather.main.feels_like)}°C
                    </p>
                  </div>
                </div>
              </div>

              {/* Country Info */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center gap-3">
                  <Image
                    src={city.country.flags.png}
                    alt={`${city.country.name.common} flag`}
                    width={24}
                    height={16}
                    className="rounded border"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{city.country.name.common}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>Capital: {city.country.capital?.[0] || 'N/A'}</span>
                      <span>Region: {city.country.region}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Places Summary */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm text-gray-700">Places to Visit</h3>
                  <span className="text-xs text-gray-500">
                    {city.places.length} places
                  </span>
                </div>

                {city.places.length > 0 ? (
                  <div className="space-y-2">
                    {city.places.slice(0, 3).map((place) => (
                      <div key={place.fsq_id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {place.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {place.categories.map(cat => cat.name).join(', ')}
                          </p>
                        </div>
                        {place.rating && (
                          <div className="text-xs text-yellow-600 ml-2">
                            ★ {place.rating}
                          </div>
                        )}
                      </div>
                    ))}
                    {city.places.length > 3 && (
                      <p className="text-xs text-gray-500 text-center mt-2">
                        +{city.places.length - 3} more places
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No places found</p>
                )}
              </div>

              {/* Actions */}
              <div className="p-4 border-t bg-gray-50">
                <Link
                  href={`/city/${city.country.name.common}/state/${encodeURIComponent(city.name)}`}
                  className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaExternalLinkAlt className="text-sm" />
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Confirmation Modal */}
        {showConfirmClear && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <div className="flex items-center gap-3 mb-4">
                <FaExclamationTriangle className="text-red-500 text-xl" />
                <h3 className="text-lg font-semibold">Clear All Cities</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove all saved cities? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 