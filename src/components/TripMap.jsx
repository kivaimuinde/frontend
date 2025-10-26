import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import polyline from "@mapbox/polyline";
import { useEffect, useMemo } from "react";

// 🗺️ Auto-fit map to route bounds
function FitBounds({ positions }) {
  const map = useMap();
  
  useEffect(() => {
    if (positions && positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] }); // add padding for UI space
    }
  }, [positions, map]);
  
  return null;
}

export default function TripMap({ trip }) {
  // 🧭 Decode route coordinates safely
  const routeCoords = useMemo(() => {
    if (!trip || !trip.route_polyline) return [];
    try {
      if (typeof trip.route_polyline === "string") {
        return polyline.decode(trip.route_polyline);
      } else if (Array.isArray(trip.route_polyline)) {
        return trip.route_polyline.map(([lon, lat]) => [lat, lon]);
      }
    } catch (err) {
      console.error("Error decoding route polyline:", err);
    }
    return [];
  }, [trip]);
  
  if (!trip || !trip.route_polyline || routeCoords.length === 0) {
    return <p className="text-muted">No route data available. Plan the route to visualize it here.</p>;
  }
  
  // 🗺️ Custom icons
  const restIcon = new L.Icon({ iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", iconSize: [28, 28] });
  const fuelIcon = new L.Icon({ iconUrl: "https://cdn-icons-png.flaticon.com/512/3104/3104972.png", iconSize: [26, 26] });
  const pickupIcon = new L.Icon({ iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684909.png", iconSize: [30, 30] });
  const dropoffIcon = new L.Icon({ iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", iconSize: [30, 30] });
  
  const startPos = routeCoords[0];
  const endPos = routeCoords[routeCoords.length - 1];

  const capitalize = (str) => {
    if (!str) return "";
    return str.replace(/\b\w/g, (c) => c.toUpperCase());
  };
  
  return (
    <div className="border rounded shadow-sm bg-white p-2">
    <MapContainer
    center={startPos}
    zoom={6}
    style={{ height: "400px", width: "100%" }}
    scrollWheelZoom={true}
    >
    <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    
    {/* 🛣️ Main route */}
    <Polyline positions={routeCoords} color="blue" weight={4} />
    
    {/* 📍 Pickup & Dropoff */}
    <Marker position={startPos} icon={pickupIcon}>
    <Popup><strong>Pickup:</strong> {capitalize(trip.pickup_location)}</Popup>
    </Marker>
    <Marker position={endPos} icon={dropoffIcon}>
    <Popup><strong>Dropoff:</strong> {capitalize(trip.dropoff_location)}</Popup>
    </Marker>
    
    {/* 💤 Rest Stops */}
    {trip.rest_stops?.map((s, i) => (
      <Marker key={`rest-${i}`} position={[s.coords[1], s.coords[0]]} icon={restIcon}>
      <Popup><strong>Rest Stop</strong><br />{s.name || `Stop ${i + 1}`}</Popup>
      </Marker>
    ))}
    
    {/* ⛽ Fuel Stops */}
    {trip.fuel_stops?.map((s, i) => (
      <Marker key={`fuel-${i}`} position={[s.coords[1], s.coords[0]]} icon={fuelIcon}>
      <Popup><strong>Fuel Stop</strong><br />{s.name || `Fuel stop ${i + 1}`}</Popup>
      </Marker>
    ))}
    
    {/* 📏 Auto-fit to route bounds */}
    <FitBounds positions={routeCoords} />
    </MapContainer>
    
    {/* 🧾 Trip Summary */}
    {trip.route_distance_miles && (
      <div className="mt-3 p-3 border rounded bg-light">
      <strong>Trip Summary</strong>
      <hr />
      <strong>Distance:</strong> {trip.route_distance_miles.toFixed(1)} miles <br />
      <strong>Duration:</strong> {(trip.route_duration_seconds / 3600).toFixed(2)} hours <br />
      {trip.avg_speed_mph && <><strong>Average Speed:</strong> {trip.avg_speed_mph.toFixed(1)} mph <br /></>}
      </div>
    )}
    </div>
  );
}
