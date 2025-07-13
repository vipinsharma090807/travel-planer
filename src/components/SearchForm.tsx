/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { SearchFormData, Country } from "@/types";
import CountryCard from "./CountryCard";

export default function SearchForm() {
  const [formData, setFormData] = useState<SearchFormData>({ cityName: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [countries, setCountries] = useState<Country[]>([]);

  const validateCityName = (cityName: string): boolean => {
    // Only allow letters and spaces
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(cityName.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ cityName: value });

    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cityName = formData.cityName.trim();

    // Validate input is not empty
    if (!cityName) {
      setError("Please enter a city name");
      return;
    }

    // Validate input contains only letters and spaces
    if (!validateCityName(cityName)) {
      setError("City name can only contain letters and spaces");
      return;
    }

    setIsLoading(true);
    setError("");
    setCountries([]);

    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${cityName}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Country[] = await response.json();
      console.log('data', data);
      setCountries(data);
      setIsLoading(false);
    } catch {
      setError("Unable to find countries. Please try again with a different search term.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            value={formData.cityName}
            onChange={handleInputChange}
            placeholder="Enter country name..."
            className="w-full text-gray-800 px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
            maxLength={100}
            aria-label="Search for a country"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-blue-500 disabled:opacity-50"
            aria-label="Search"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            ) : (
              <FaSearch className="w-4 h-4" />
            )}
          </button>
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center" role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full max-w-md mx-auto block bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Searching..." : "Search Country"}
        </button>
      </form>

      {/* Display country cards */}
      {countries.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Search Results ({countries.length} {countries.length === 1 ? 'country' : 'countries'})
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 overflow-x-auto">
            {countries.map((country) => (
              <CountryCard key={country.cca3} country={country} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
