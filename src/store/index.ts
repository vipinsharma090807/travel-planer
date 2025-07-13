import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { SavedCity } from "@/types";

interface TravelPlannerState {
  savedCities: SavedCity[];
  addSavedCity: (city: SavedCity) => void;
  removeSavedCity: (cityName: string) => void;
  isCitySaved: (cityName: string) => boolean;
  clearAllSavedCities: () => void;
}

export const useTravelPlannerStore = create<TravelPlannerState>()(
  persist(
    (set, get) => ({
      savedCities: [],

      addSavedCity: (city: SavedCity) => {
        const { savedCities } = get();
        const existingCityIndex = savedCities.findIndex(
          (savedCity) => savedCity.name.toLowerCase() === city.name.toLowerCase()
        );

        if (existingCityIndex === -1) {
          // Add new city
          set({ savedCities: [...savedCities, city] });
        } else {
          // Update existing city with new data
          const updatedCities = [...savedCities];
          updatedCities[existingCityIndex] = city;
          set({ savedCities: updatedCities });
        }
      },

      removeSavedCity: (cityName: string) => {
        const { savedCities } = get();
        const updatedCities = savedCities.filter((city) => city.name.toLowerCase() !== cityName.toLowerCase());
        set({ savedCities: updatedCities });
      },

      isCitySaved: (cityName: string) => {
        const { savedCities } = get();
        return savedCities.some((city) => city.name.toLowerCase() === cityName.toLowerCase());
      },

      clearAllSavedCities: () => {
        set({ savedCities: [] });
      },
    }),
    {
      name: "travel-planner-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
