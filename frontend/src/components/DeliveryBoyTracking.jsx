import React from "react";
import scooter from "../assets/scooter.png";
import home from "../assets/home.png";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";

/* ---------------- Icons ---------------- */

const deliveryBoyIcon = new L.Icon({
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

/* ---------------- Component ---------------- */

function DeliveryBoyTracking({ data }) {
  // Extract coordinates safely
  const deliveryBoyLocation = data?.deliveryBoyLocation;
  const customerLocation = data?.customerLocation;

  // If data not available, don't render map
  if (!deliveryBoyLocation || !customerLocation) {
    return null;
  }

  const deliveryBoyLat = deliveryBoyLocation.lat;
  const deliveryBoyLon = deliveryBoyLocation.lon;

  const customerLat = customerLocation.lat;
  const customerLon = customerLocation.lon;

  // Extra safety check
  if (
    deliveryBoyLat == null ||
    deliveryBoyLon == null ||
    customerLat == null ||
    customerLon == null
  ) {
    return null;
  }

  const path = [
    [deliveryBoyLat, deliveryBoyLon],
    [customerLat, customerLon],
  ];

  const center = [deliveryBoyLat, deliveryBoyLon];

  return (
    <div className="w-full mt-6">
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        {/* Map */}
        <div className="h-[350px] w-full">
          <MapContainer center={center} zoom={15} className="h-full w-full">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Delivery Boy Marker */}
            <Marker
              position={[deliveryBoyLat, deliveryBoyLon]}
              icon={deliveryBoyIcon}
            >
              <Popup>🛵 Delivery Partner</Popup>
            </Marker>

            {/* Customer Marker */}
            <Marker position={[customerLat, customerLon]} icon={customerIcon}>
              <Popup>🏠 Customer Location</Popup>
            </Marker>

            {/* Line Between Them */}
            <Polyline
              positions={path}
              pathOptions={{
                color: "#22c55e",
                weight: 5,
              }}
            />
          </MapContainer>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-4 py-3 text-sm bg-gray-50">
          <span className="text-gray-600">📍 Live Tracking</span>
          <span className="text-green-600 font-semibold">On the way</span>
        </div>
      </div>
    </div>
  );
}

export default DeliveryBoyTracking;
