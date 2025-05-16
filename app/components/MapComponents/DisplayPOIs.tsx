import {Icon} from "leaflet";
import {Marker} from "react-leaflet";
import {PoiAcceptanceStatus, PointOfInterest} from "@/types/poi";
import {FC} from "react";
import { useLayerFilter } from "./LayerFilterContext";

function ColoredMarker(color: string): Icon {
    const svgString = `
<svg width="35" height="65" viewBox="-5 -5 45 65" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="white" flood-opacity="0.4"/>
    </filter>
  </defs>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.01639 21.8641L17.125 34.5L27.2337 21.8641C29.1862 19.4235 30.25 16.3909 30.25 13.2652V12.625C30.25 5.37626 24.3737 -0.5 17.125 -0.5C9.87626 -0.5 4 5.37626 4 12.625V13.2652C4 16.3909 5.06378 19.4235 7.01639 21.8641ZM17.125 17C19.5412 17 21.5 15.0412 21.5 12.625C21.5 10.2088 19.5412 8.25 17.125 8.25C14.7088 8.25 12.75 10.2088 12.75 12.625C12.75 15.0412 14.7088 17 17.125 17Z" stroke="white" stroke-width="1.2" filter="url(#glow)" fill="${color}" shape-rendering="geometricPrecision"/>
</svg>
`;
    const svgUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;

    return new Icon({
        iconUrl: svgUrl,
        iconSize: [52, 52],
        iconAnchor: [32, 32],
    });
}

export const DisplayPOIs: FC<{
    pois: PointOfInterest[];
    setSelectedPoiId: (id: number) => void;
    zoomToPoi?: (poi: PointOfInterest) => void;
}> = ({ pois, setSelectedPoiId, zoomToPoi }) => {
    const { filter } = useLayerFilter();
    
    // Filter POIs based on the layer filter settings
    const filteredPois = pois.filter(poi => {
        // If filter arrays are empty, show all POIs (no filtering)
        const statusFilter = filter.poiFilter.status.length === 0 || filter.poiFilter.status.includes(poi.status);
        const categoryFilter = filter.poiFilter.category.length === 0 || filter.poiFilter.category.includes(poi.category);
        const priorityFilter = filter.poiFilter.priority.length === 0 || filter.poiFilter.priority.includes(poi.priority);
        const creatorFilter = filter.poiFilter.creatorUserIds.length === 0 || filter.poiFilter.creatorUserIds.includes(poi.creatorId);
        
        return statusFilter && categoryFilter && priorityFilter && creatorFilter;
    });

    return (
        <>
            {filteredPois.map((poi) => {
                let color = "#000000";
                if (poi.status === PoiAcceptanceStatus.PENDING) color = "#ff9900";
                else if (poi.status === PoiAcceptanceStatus.ACCEPTED) color = "#79A44D";
                else if (poi.status === PoiAcceptanceStatus.DECLINED) color = "#FF0000";

                return (
                    <Marker
                        key={poi.poiId}
                        position={[
                            poi.coordinate.coordinates[1],
                            poi.coordinate.coordinates[0],
                        ]}
                        icon={ColoredMarker(color)}
                        eventHandlers={{
                            click: () => {
                                setSelectedPoiId(poi.poiId);
                                if (zoomToPoi) zoomToPoi(poi);
                            },
                        }}
                    />
                );
            })}
        </>
    );
};
