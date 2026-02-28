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

const deliveryBoyIcon = new L.icon({
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const customerIcon = new L.icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function DeliveryBoyTracking({ data }) {
  const deliveryBoyLat = data.deliveryBoyLocation.lat;
  const deliveryBoyLon = data.deliveryBoyLocation.lon;

  const customerLat = data.CustomerLocation.lat;
  const customerLon = data.CustomerLocation.lon;

  // ✅ FIXED polyline path
  const path = [
    [deliveryBoyLat, deliveryBoyLon],
    [customerLat, customerLon],
  ];

  const center = [deliveryBoyLat, deliveryBoyLon];

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      {/* Card */}
      <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Header */}

        {/* Map */}
        <div className="h-[350px] sm:h-[450px] w-full">
          <MapContainer center={center} zoom={17} className="h-full w-full z-0">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* <Marker
              position={[deliveryBoyLat, deliveryBoyLon]}
              icon={deliveryBoyIcon}
            >
              <Popup>🛵 Delivery Boy</Popup>
            </Marker> */}

            <Marker
              key={data.deliveryBoy?._id}
              position={[deliveryBoyLat, deliveryBoyLon]}
              icon={deliveryBoyIcon}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">
                    🛵 {data.deliveryBoy?.fullName}
                  </p>
                  <p className="text-gray-500 text-xs">
                    📞 {data.deliveryBoy?.mobile}
                  </p>
                </div>
              </Popup>
            </Marker>

            <Marker position={[customerLat, customerLon]} icon={customerIcon}>
              <Popup>🏠 Customer Location</Popup>
            </Marker>

            <Polyline
              positions={path}
              pathOptions={{
                color: "#22c55e", // tailwind green-500
                weight: 5,
              }}
            />
          </MapContainer>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-5 py-4 text-sm text-gray-600 bg-gray-50">
          <span>📍 Real-time location</span>
          <span className="font-medium text-green-600">On the way</span>
        </div>
      </div>
    </div>
  );
}

export default DeliveryBoyTracking;
