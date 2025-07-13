/* eslint-disable @typescript-eslint/no-explicit-any */

import SearchForm from "@/components/SearchForm";
import Link from "next/link";
import { FaMapMarkerAlt, FaCloud, FaGlobe, FaBookmark } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-blue-600 text-2xl" />
            <h1 className="text-xl font-bold text-gray-900">Travel Planner</h1>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaBookmark />
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Plan Your Next <span className="text-blue-600">Adventure</span>
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Search for any city around the world to discover weather conditions,
            country information, and amazing places to visit.
          </p>
        </div>

        {/* Search Form */}
        <SearchForm />

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FaCloud className="text-blue-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Weather Information
            </h3>
            <p className="text-gray-600">
              Get current weather conditions, temperature, humidity, and wind speed for any city.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FaGlobe className="text-green-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Country Details
            </h3>
            <p className="text-gray-600">
              Explore country information including capital, population, region, and currency.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FaMapMarkerAlt className="text-purple-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Places to Visit
            </h3>
            <p className="text-gray-600">
              Discover popular attractions, restaurants, and points of interest in any city.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-gray-500">
            Powered by OpenWeatherMap, RestCountries, and Foursquare APIs
          </p>
        </div>
      </footer>
    </div>
  );
}
