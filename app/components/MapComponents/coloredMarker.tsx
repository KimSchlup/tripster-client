import {Icon} from "leaflet";

export function ColoredMarker(color: string): Icon {
    const svgString = `
    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M7.01639 21.8641L17.125 34.5L27.2337 21.8641C29.1862 19.4235 30.25 16.3909 30.25 13.2652V12.625C30.25 5.37626 24.3737 -0.5 17.125 -0.5C9.87626 -0.5 4 5.37626 4 12.625V13.2652C4 16.3909 5.06378 19.4235 7.01639 21.8641ZM17.125 17C19.5412 17 21.5 15.0412 21.5 12.625C21.5 10.2088 19.5412 8.25 17.125 8.25C14.7088 8.25 12.75 10.2088 12.75 12.625C12.75 15.0412 14.7088 17 17.125 17Z" fill="${color}"/>
    </svg>
  `;
    const svgUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;

    return new Icon({
        iconUrl: svgUrl,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });
}