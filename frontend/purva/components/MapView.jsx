import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import '../styles/map.css';

// Fix standard Leaflet default icon issues in bundlers
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const DEFAULT_CENTER = [23.3441, 85.3096]; // Ranchi, Jharkhand default coordinates

export const MapView = ({ issues = [], onMarkerClick }) => {
  return (
    <div className="w-full h-[550px] rounded-xl overflow-hidden shadow-md border border-gray-200 bg-white relative">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {issues.map((issue) => {
          // MongoDB GeoJSON format: [longitude, latitude]
          // Leaflet expects: [latitude, longitude]
          if (
            !issue.location ||
            !Array.isArray(issue.location.coordinates) ||
            issue.location.coordinates.length < 2
          ) {
            return null;
          }

          const [lng, lat] = issue.location.coordinates;
          if (typeof lat !== 'number' || typeof lng !== 'number') {
            return null;
          }

          return (
            <Marker key={issue._id || issue.id} position={[lat, lng]}>
              <Popup className="custom-map-popup">
                <div className="p-3 max-w-[220px]">
                  {issue.imageUrl && (
                    <img
                      src={issue.imageUrl}
                      alt={issue.category}
                      className="w-full h-24 object-cover rounded-md mb-2 bg-gray-100"
                    />
                  )}
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-xs text-gray-900">{issue.category}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                      {issue.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 line-clamp-2 mb-2">
                    {issue.description}
                  </p>
                  <button
                    onClick={() => onMarkerClick && onMarkerClick(issue)}
                    className="w-full text-center text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-1 px-2 rounded transition-colors"
                  >
                    View & Update
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
