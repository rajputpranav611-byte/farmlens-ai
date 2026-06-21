import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import L from 'leaflet';

// Fix leaflet icon issue in react
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const stores = [
  { id: 1, name: "Kisan Agri Mall", address: "CG Road, Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { id: 2, name: "Gujarat Agro Center", address: "Ring Road, Surat", lat: 21.1702, lng: 72.8311 },
  { id: 3, name: "Saurashtra Seeds & Fertilizers", address: "Kalawad Road, Rajkot", lat: 22.3039, lng: 70.8022 },
  { id: 4, name: "Baroda Farming Solutions", address: "Alkapuri, Vadodara", lat: 22.3072, lng: 73.1812 },
  { id: 5, name: "Bhavnagar Krushi Seva", address: "Waghawadi Road, Bhavnagar", lat: 21.7645, lng: 72.1519 }
];

const StoresScreen = ({ onNavigate, onStartScan }) => {
  const gujaratCenter = [22.2587, 71.1924];

  const handleTabChange = (tabId) => {
    if (tabId === 'scan') {
      onStartScan?.();
      return;
    }

    onNavigate?.(tabId);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans max-w-md mx-auto sm:border-x sm:border-gray-200 relative">
      <header className="px-6 py-5 bg-white text-gray-800 border-b border-gray-100 z-10 shadow-sm relative">
        <h1 className="text-xl font-bold tracking-wide">Nearby Agri Stores</h1>
        <p className="text-sm text-gray-500">Gujarat Region</p>
      </header>

      <main className="flex-1 relative pb-20">
        <MapContainer center={gujaratCenter} zoom={7} className="w-full h-full z-0" zoomControl={false}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          {stores.map(store => (
            <Marker key={store.id} position={[store.lat, store.lng]}>
              <Popup>
                <div className="font-sans">
                  <h3 className="font-bold text-base m-0 text-gray-800">{store.name}</h3>
                  <p className="text-sm text-gray-600 m-0 mt-1 mb-3">{store.address}</p>
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-semibold no-underline w-full justify-center transition-colors"
                  >
                    <Navigation size={16} /> Get Directions
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </main>

      <BottomNav activeTab="stores" onTabChange={handleTabChange} />
    </div>
  );
};

export default StoresScreen;
