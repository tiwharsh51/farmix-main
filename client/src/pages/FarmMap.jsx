import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { MapPin, Save, List, Loader } from 'lucide-react';
import api from '../services/api';
import PageTransition from '../components/PageTransition';
import { toast } from 'react-toastify';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '0.75rem'
};

const defaultCenter = {
  lat: 28.6139, // Default to New Delhi
  lng: 77.2090
};

const FarmMap = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''
  });

  const [map, setMap] = useState(null);
  const [clickedPos, setClickedPos] = useState(null);
  const [farmName, setFarmName] = useState('');
  const [savedLocations, setSavedLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await api.get('/farm/location');
      if (res.data.success) {
        setSavedLocations(res.data.data);
      }
    } catch (error) {
      toast.error('Failed to load saved farm locations');
    }
  };

  const onMapClick = useCallback((e) => {
    setClickedPos({
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    });
  }, []);

  const handleSaveLocation = async (e) => {
    e.preventDefault();
    if (!clickedPos || !farmName.trim()) {
      toast.warning('Please select a location on the map and enter a name.');
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.post('/farm/location', {
        farmName,
        latitude: clickedPos.lat,
        longitude: clickedPos.lng
      });
      if (res.data.success) {
        toast.success('Farm location saved successfully!');
        setFarmName('');
        setClickedPos(null);
        fetchLocations();
      }
    } catch (error) {
      toast.error('Failed to save location.');
    } finally {
      setLoading(false);
    }
  };

  const centerToSaved = (lat, lng) => {
    if (map) {
      map.panTo({ lat, lng });
      map.setZoom(14);
    }
  };

  return (
    <PageTransition>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center gap-6">
            <div className="p-4 bg-nature-100 dark:bg-nature-900/40 rounded-xl">
               <MapPin className="w-10 h-10 text-nature-600 dark:text-nature-400" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Farm Mapping Toolkit</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Pinpoint your farm coordinates on the map. Saved coordinates can interface directly with our satellite monitoring modules.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Map Area */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-[532px]">
              {!process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? (
                 <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-500 dark:text-gray-400 p-8 text-center ring-1 ring-inset ring-gray-200 dark:ring-gray-600">
                   <MapPin className="w-16 h-16 text-gray-300 dark:text-gray-500 mb-4" />
                   <h3 className="font-semibold text-lg">Google Maps API Key Missing</h3>
                   <p className="mt-2 text-sm">To enable interactive mapping, please provide a valid `REACT_APP_GOOGLE_MAPS_API_KEY` in your client environment variables.</p>
                   {/* Fallback mock UI for clicking */}
                   <button 
                     onClick={() => setClickedPos({ lat: defaultCenter.lat + 0.05, lng: defaultCenter.lng + 0.05 })}
                     className="mt-6 px-4 py-2 bg-gray-800 text-white rounded-lg text-sm"
                   >
                     Simulate Map Click (Development Mode)
                   </button>
                 </div>
              ) : !isLoaded ? (
                <div className="w-full h-full flex items-center justify-center">
                   <Loader className="w-10 h-10 text-nature-600 animate-spin" />
                </div>
              ) : (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={defaultCenter}
                  zoom={10}
                  onClick={onMapClick}
                  onLoad={map => setMap(map)}
                  options={{
                    disableDefaultUI: false,
                    zoomControl: true,
                    mapTypeControl: true,
                    styles: [
                      {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }]
                      }
                    ]
                  }}
                >
                  {/* Current Click */}
                  {clickedPos && <Marker position={clickedPos} />}
                  
                  {/* Saved Locations */}
                  {savedLocations.map((loc) => (
                    <Marker 
                      key={loc._id} 
                      position={{ lat: loc.latitude, lng: loc.longitude }}
                      icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png" 
                    />
                  ))}
                </GoogleMap>
              )}
            </div>

            {/* Sidebar Controls */}
            <div className="space-y-6">
              
              {/* Save Form */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Save className="w-5 h-5 text-nature-600 dark:text-nature-400" /> Save Location
                </h3>
                <form onSubmit={handleSaveLocation} className="space-y-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Farm/Sector Name</label>
                     <input
                       type="text"
                       required
                       value={farmName}
                       onChange={(e) => setFarmName(e.target.value)}
                       placeholder="e.g. North Wheat Field"
                       className="input-field bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                     />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Latitude</label>
                       <input
                         type="text"
                         readOnly
                         value={clickedPos?.lat?.toFixed(5) || ''}
                         placeholder="Click map"
                         className="w-full bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-md py-2 px-3 text-sm text-gray-600 dark:text-gray-300 cursor-not-allowed"
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Longitude</label>
                       <input
                         type="text"
                         readOnly
                         value={clickedPos?.lng?.toFixed(5) || ''}
                         placeholder="Click map"
                         className="w-full bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-md py-2 px-3 text-sm text-gray-600 dark:text-gray-300 cursor-not-allowed"
                       />
                     </div>
                   </div>
                   <button
                     type="submit"
                     disabled={loading || !clickedPos || !farmName.trim()}
                     className="w-full btn-primary py-2.5 disabled:opacity-50 flex justify-center"
                   >
                     {loading ? 'Saving...' : 'Save Coordinates'}
                   </button>
                </form>
              </div>

              {/* Saved List */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <List className="w-5 h-5 text-nature-600 dark:text-nature-400" /> Saved Farms
                </h3>
                {savedLocations.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No locations saved yet.</p>
                ) : (
                  <ul className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-hide">
                    {savedLocations.map((loc) => (
                      <li key={loc._id} className="p-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl hover:border-nature-300 dark:hover:border-nature-500 transition-colors cursor-pointer" onClick={() => centerToSaved(loc.latitude, loc.longitude)}>
                        <h4 className="font-semibold text-gray-800 dark:text-white text-sm">{loc.farmName}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">
                          {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default FarmMap;
