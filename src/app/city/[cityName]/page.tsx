'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaSearch, FaSpinner } from 'react-icons/fa';

export default function CityListPage() {
  const params = useParams();
  const router = useRouter();
  const [search, setSearch] = useState<string>('');
  const [cities, setCities] = useState<{ name: string }[]>([]);
  const [filteredCities, setFilteredCities] = useState<{ name: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCities = async () => {
      setIsLoading(true);
      setError('');
      setCities([]);
      setFilteredCities([]);
      try {
        if (!params.cityName) {
          setError('No country specified.');
          setIsLoading(false);
          return;
        }
        const decodedCountry = decodeURIComponent(params.cityName as string);
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ country: decodedCountry }),
        });

        const data = await res.json();
        const state = data.data.states;
        setCities(state);
        setFilteredCities(state);
        setIsLoading(false);
      } catch (error: unknown) {
        console.log(error);
        setError('Failed to load cities.');
        setIsLoading(false);
      }
    };
    fetchCities();
  }, [params.cityName]);

  // Filter cities based on search
  useEffect(() => {
    if (!search) {
      setFilteredCities(cities);
    } else {
      setFilteredCities(
        cities.filter((city) =>
          city.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, cities]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 text-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Country Search
          </Link>
        </div>
        <div className="max-w-2xl mx-auto bg-white/90 rounded-2xl shadow-xl p-8 border border-blue-100">
          <h1 className="text-3xl font-extrabold mb-6 text-center tracking-tight drop-shadow-lg">
            Cities in{' '}
            <span className="text-blue-700">
              {params.cityName ? decodeURIComponent(params.cityName as string) : ''}
            </span>
          </h1>
          <form
            className="flex items-center gap-2 mb-6"
            onSubmit={e => e.preventDefault()}
            autoComplete="off"
          >
            <div className="relative flex-1">
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Search for a city..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search cities"
              />
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400" />
            </div>
          </form>
          {isLoading ? (
            <div className="flex flex-col items-center py-12">
              <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
              <div className="text-lg font-semibold text-blue-700">Loading cities...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-2xl font-bold text-red-600 mb-2">Error</div>
              <div className="text-gray-600 mb-4">{error}</div>
              <Link
                href="/"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Search
              </Link>
            </div>
          ) : (
            <>
              {filteredCities.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No cities found.
                </div>
              ) : (
                <ol className="list-decimal pl-6 space-y-3 max-h-[60vh] overflow-y-auto">
                  {filteredCities.map((city:{name:string}) => (
                    <li
                      key={city.name}
                      className="bg-blue-50 hover:bg-blue-100 transition rounded-lg px-4 py-3 shadow-sm flex items-center justify-between cursor-pointer"
                      onClick={() => router.push(`/city/${params.cityName}/state/${encodeURIComponent(city.name)}`)}
                    >
                      <span className="font-medium text-lg">{city.name}</span>
                      <span className="text-blue-500 text-sm">View Weather</span>
                    </li>
                  ))}
                </ol>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
