import React from "react";
import { Country } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CountryCardProps {
  country: Country;
}

export default function CountryCard({ country }: CountryCardProps) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/city/${country.name.common}`)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow h-full flex flex-col min-h-[380px]"
      // style={{ minWidth: 260, maxWidth: 340 }}
    >
      {/* Header Section - Fixed Height */}
      <div className="flex items-center gap-4 p-6 pb-4">
        <Image
          src={country.flags.png}
          alt={`Flag of ${country.name.common}`}
          className="w-16 h-12 object-cover rounded border flex-shrink-0"
          height={100}
          width={100}
        />
        <div className="min-w-0 flex-1">
          <h3
            className="text-lg font-bold text-gray-800 truncate cursor-pointer relative group"
            title={`${country.name.official} (${country.name.common})`}
            style={{ minWidth: 0, maxWidth: 180 }}
          >
            {country.name.common}
            {/* Custom tooltip */}
            <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10 pointer-events-none">
              <div className="font-semibold">{country.name.official}</div>
              <div className="text-xs text-gray-300">({country.name.common})</div>
              {/* Tooltip arrow */}
              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
            </div>
          </h3>
          <p
            className="text-gray-600 text-sm truncate cursor-help"
            title={country.name.official}
            style={{ minWidth: 0, maxWidth: 180 }}
          >
            {country.name.official}
          </p>
        </div>
      </div>

      {/* Content Section - Flexible Height */}
      <div className="px-6 pb-4 flex-1">
        <div className="grid grid-cols-2 gap-3 text-sm h-full min-w-[180px] max-w-full">
          <div>
            <p className="font-semibold text-gray-700 mb-1">Capital:</p>
            <p
              className="text-gray-600 text-xs leading-relaxed cursor-help truncate"
              title={country.capital?.join(", ") || "N/A"}
              style={{ minWidth: 0, maxWidth: 120 }}
            >
              {country.capital?.slice(0, 2).join(", ") || "N/A"}
              {country.capital && country.capital.length > 2 && "..."}
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-700 mb-1">Population:</p>
            <p
              className="text-gray-600 text-xs leading-relaxed truncate"
              title={country.population.toLocaleString()}
              style={{ minWidth: 0, maxWidth: 120 }}
            >
              {country.population.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-700 mb-1">Region:</p>
            <p
              className="text-gray-600 text-xs leading-relaxed truncate"
              title={country.region}
              style={{ minWidth: 0, maxWidth: 120 }}
            >
              {country.region}
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-700 mb-1">Area:</p>
            <p
              className="text-gray-600 text-xs leading-relaxed truncate"
              title={`${country.area?.toLocaleString() || "N/A"} km²`}
              style={{ minWidth: 0, maxWidth: 120 }}
            >
              {country.area?.toLocaleString() || "N/A"} km²
            </p>
          </div>

          <div className="col-span-2">
            <p className="font-semibold text-gray-700 mb-1">Languages:</p>
            <div className="relative group w-full">
              <p
                className="text-gray-600 text-xs leading-relaxed truncate cursor-help w-full"
                title={country.languages ? Object.values(country.languages).join(", ") : "N/A"}
                style={{ minWidth: 0, maxWidth: 220, display: "block" }}
              >
                {country.languages ? Object.values(country.languages).join(", ") : "N/A"}
              </p>
              {/* Tooltip for languages */}
              {country.languages && (
                <div className="absolute left-0 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 pointer-events-none whitespace-pre-line max-w-xs break-words">
                  {Object.values(country.languages).join(", ")}
                  <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-2">
            <p className="font-semibold text-gray-700 mb-1">Currencies:</p>
            <div className="relative group w-full">
              <p
                className="text-gray-600 text-xs leading-relaxed truncate cursor-help w-full"
                title={
                  country.currencies
                    ? Object.entries(country.currencies)
                        .map(([, currency]) => `${currency.name} (${currency.symbol})`)
                        .join(", ")
                    : "N/A"
                }
                style={{ minWidth: 0, maxWidth: 220, display: "block" }}
              >
                {country.currencies
                  ? Object.entries(country.currencies)
                      .map(([, currency]) => `${currency.name} (${currency.symbol})`)
                      .join(", ")
                  : "N/A"}
              </p>
              {/* Tooltip for currencies */}
              {country.currencies && (
                <div className="absolute left-0 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 pointer-events-none whitespace-pre-line max-w-xs break-words">
                  {Object.entries(country.currencies)
                    .map(([, currency]) => `${currency.name} (${currency.symbol})`)
                    .join(", ")}
                  <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section - Fixed Height */}
      <div className="px-6 py-4 border-t border-gray-200 mt-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 truncate" title={country.subregion || country.region}>
              {country.subregion || country.region}
            </span>
          </div>
          <span className="text-xl">{country.flag}</span>
        </div>
      </div>
    </div>
  );
}
