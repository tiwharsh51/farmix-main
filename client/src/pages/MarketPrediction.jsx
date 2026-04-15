import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import PageTransition from '../components/PageTransition';
import SkeletonLoader from '../components/SkeletonLoader';

const MarketPrediction = () => {
  const [prices, setPrices] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [loading, setLoading] = useState(false);
  const [forecastLoading, setForecastLoading] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      try {
        const res = await api.get('/market/prices');
        if (res.data.success) {
          setPrices(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load market prices');
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, []);

  useEffect(() => {
    const fetchForecast = async () => {
      setForecastLoading(true);
      try {
        const res = await api.get(`/market/predict?crop=${selectedCrop}`);
        if (res.data.success) {
          setForecast(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load forecast');
      } finally {
        setForecastLoading(false);
      }
    };
    if (selectedCrop) fetchForecast();
  }, [selectedCrop]);

  return (
    <PageTransition>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-600" /> Market Intelligence
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Live mandi prices and AI-driven price forecasting for upcoming months.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Current Prices List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Today's Mandi Rates</h2>
              
              {loading ? (
                 <SkeletonLoader type="text" count={5} />
              ) : (
                prices.map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedCrop(item.crop)}
                    className={`card p-4 cursor-pointer hover:border-nature-500 transition-colors ${selectedCrop === item.crop ? 'border-nature-500 ring-1 ring-nature-500' : 'border-transparent'}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{item.crop}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">per {item.unit}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">₹{item.price.min} - ₹{item.price.max}</p>
                        <div className={`flex items-center justify-end gap-1 text-sm font-medium ${item.trend === 'up' ? 'text-green-500' : item.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                          {item.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : item.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : null}
                          {item.trend === 'stable' ? 'Stable' : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* AI Forecast Chart */}
            <div className="lg:col-span-2 card p-6">
               <div className="flex justify-between items-center mb-6">
                 <div>
                   <h2 className="text-xl font-bold text-gray-900 dark:text-white">6-Month Forecast Model</h2>
                   <p className="text-sm text-gray-500 dark:text-gray-400">Projected trends for {selectedCrop}</p>
                 </div>
               </div>

               {forecastLoading ? (
                 <SkeletonLoader type="card" count={1} />
               ) : forecast?.forecast ? (
                 <div className="h-80 w-full mt-4">
                   <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={forecast.forecast} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                       <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} vertical={false} />
                       <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} />
                       <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(val) => `₹${val}`} />
                       <Tooltip 
                          contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '0.5rem', color: '#fff' }}
                          itemStyle={{ color: '#10b981' }}
                          formatter={(value) => [`₹${value}`, 'Predicted Price']}
                       />
                       <Line type="monotone" dataKey="predictedPrice" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                     </LineChart>
                   </ResponsiveContainer>
                 </div>
               ) : (
                 <div className="h-80 flex items-center justify-center text-gray-500">
                    Select a crop to view forecasts.
                 </div>
               )}

            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default MarketPrediction;
