"use client";

// LayerFilterContext.tsx
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { PoiAcceptanceStatus, PoiCategory, PoiPriority } from "@/types/poi";

type BasemapType = "OPEN_STREET_MAP" | "SATELLITE" | "TOPOGRAPHY";

interface LayerFilter {
  basemapType: BasemapType;
  showRoutes: boolean;
  routeFilter: {
    status: string[];
  };
  poiFilter: {
    status: PoiAcceptanceStatus[];
    category: PoiCategory[];
    priority: PoiPriority[];
    creatorUserIds: number[];
  };
}

interface LayerFilterContextProps {
  filter: LayerFilter;
  setFilter: (newFilter: Partial<LayerFilter>) => void;
  setPOIFilter: (updates: Partial<LayerFilter["poiFilter"]>) => void;
  setRouteFilter: (updates: Partial<LayerFilter["routeFilter"]>) => void;
}

const defaultFilter: LayerFilter = {
  basemapType: "OPEN_STREET_MAP",
  showRoutes: true,
  routeFilter: {
    status: ["ACCEPTED", "PENDING", "DECLINED"],
  },
  poiFilter: {
    status: Object.values(PoiAcceptanceStatus),
    category: Object.values(PoiCategory),
    priority: Object.values(PoiPriority),
    creatorUserIds: [],
  },
};

const LayerFilterContext = createContext<LayerFilterContextProps | undefined>(
  undefined
);

export const LayerFilterProvider = ({ children }: { children: ReactNode }) => {
  const [filter, setFilterState] = useState<LayerFilter>(defaultFilter);

  const setFilter = useCallback((updates: Partial<LayerFilter>) => {
    setFilterState((prev) => ({ ...prev, ...updates }));
  }, []);

  const setPOIFilter = useCallback(
    (updates: Partial<LayerFilter["poiFilter"]>) => {
      setFilterState((prev) => ({
        ...prev,
        poiFilter: { ...prev.poiFilter, ...updates },
      }));
    },
    []
  );

  const setRouteFilter = useCallback(
    (updates: Partial<LayerFilter["routeFilter"]>) => {
      setFilterState((prev) => ({
        ...prev,
        routeFilter: { ...prev.routeFilter, ...updates },
      }));
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      filter,
      setFilter,
      setPOIFilter,
      setRouteFilter,
    }),
    [filter, setFilter, setPOIFilter, setRouteFilter]
  );

  return (
    <LayerFilterContext.Provider value={contextValue}>
      {children}
    </LayerFilterContext.Provider>
  );
};

export const useLayerFilter = () => {
  const context = useContext(LayerFilterContext);
  if (!context)
    throw new Error("useLayerFilter must be used within LayerFilterProvider");
  return context;
};
