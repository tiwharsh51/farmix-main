import React, { useState, useEffect } from 'react';
import { Droplet, ThermometerSun, CloudRain, AlertCircle } from 'lucide-react';
import api from '../services/api';

const IoTDashboardWidget = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIoT = async () => {
      try {
        const res = await api.get('/iot/data');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error("Failed to load IoT data");
      } finally {
        setLoading(false);
      }
    };
    fetchIoT();

    // Poll every 10 seconds for real-time feel
    const interval = setInterval(fetchIoT, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="flex gap-4">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
    </div>
  );

  const moisture = data?.current?.moisture || 0;
  const temp = data?.current?.temperature || 0;
  
  const isMoistureLow = moisture < 35;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nature-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-nature-500"></span>
            </span>
            Live Farm Sensors
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">Updated just now</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        
        {/* Soil Moisture */}
        <div className={`p-4 rounded-xl flex items-center justify-between transition-colors ${isMoistureLow ? 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800' : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-50 dark:border-blue-800'}`}>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Soil Moisture</p>
                <p className={`text-2xl font-bold ${isMoistureLow ? 'text-red-700 dark:text-red-400' : 'text-blue-700 dark:text-blue-400'}`}>
                    {moisture}%
                </p>
            </div>
            <div className={`p-3 rounded-full ${isMoistureLow ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'}`}>
                <Droplet className="w-6 h-6" />
            </div>
        </div>

        {/* Temperature */}
        <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-50 dark:border-orange-800 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Temperature</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                    {temp}°C
                </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 rounded-full">
                <ThermometerSun className="w-6 h-6" />
            </div>
        </div>

      </div>

      {isMoistureLow && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-300">Irrigation Alert</p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">Soil moisture is critically low in Sector A. Recommend immediate watering.</p>
            </div>
            <button className="ml-auto flex-shrink-0 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded flex items-center gap-1 transition-colors">
                <CloudRain className="w-3 h-3" /> Start Pump
            </button>
        </div>
      )}

    </div>
  );
};

export default IoTDashboardWidget;
