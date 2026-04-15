import React, { useState } from 'react';
import { Sprout, Droplets, Thermometer, CloudRain } from 'lucide-react';
import api from '../services/api';
import PageTransition from '../components/PageTransition';
import WeatherWidget from '../components/WeatherWidget';

const CropRecommendation = () => {
  const [formData, setFormData] = useState({
    soilType: '',
    rainfall: '',
    temperature: '',
    humidity: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const soilTypes = ['Alluvial', 'Black', 'Red', 'Laterite', 'Desert', 'Mountain'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await api.post('/crop/recommend', formData);
      if(res.data.success) {
        setResult(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-nature-100 dark:bg-nature-900/40 rounded-full mb-4">
               <Sprout className="h-8 w-8 text-nature-600 dark:text-nature-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Smart Crop Recommendation</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Enter your land's specific soil and weather parameters to receive data-driven recommendations on the optimal crop to maximize your harvest.
          </p>
        </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col - Weather & Fast Inputs */}
            <div className="lg:col-span-1 space-y-6">
              <WeatherWidget 
                onWeatherDataReturn={(weather) => {
                  setFormData(prev => ({
                    ...prev,
                    temperature: prev.temperature || weather.temp,
                    humidity: prev.humidity || weather.humidity,
                    rainfall: prev.rainfall || weather.rainfall
                  }));
                }}
              />
              <div className="card p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <span className="font-bold">Pro Tip:</span> We automatically fetch weather data for your region to speed up the process. You can override these values in the form.
                </p>
              </div>
            </div>

            {/* Right Col - Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-8 bg-white dark:bg-gray-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 font-sans">Farm Parameters</h2>
                
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-300 p-3 rounded-md text-sm mb-6">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="soilType">
                      Soil Type
                    </label>
                    <select
                      name="soilType"
                      id="soilType"
                      required
                      value={formData.soilType}
                      onChange={handleChange}
                      className="input-field bg-white dark:bg-gray-700"
                    >
                      <option value="" disabled>Select soil type</option>
                      {soilTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="rainfall">
                    <div className="flex items-center gap-2">
                      <CloudRain className="w-4 h-4 text-blue-500" />
                      Annual Rainfall (mm)
                    </div>
                  </label>
                  <input
                    type="number"
                    name="rainfall"
                    id="rainfall"
                    required
                    min="0"
                    placeholder="e.g. 1200"
                    value={formData.rainfall}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="temperature">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-orange-500" />
                        Temp (°C)
                      </div>
                    </label>
                    <input
                      type="number"
                      name="temperature"
                      id="temperature"
                      required
                      placeholder="e.g. 25"
                      value={formData.temperature}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="humidity">
                       <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-cyan-500" />
                        Humidity (%)
                      </div>
                    </label>
                    <input
                      type="number"
                      name="humidity"
                      id="humidity"
                      required
                      min="0"
                      max="100"
                      placeholder="e.g. 60"
                      value={formData.humidity}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 flex justify-center items-center"
                >
                  {loading ? (
                    <span className="animate-pulse">Analyzing Data...</span>
                  ) : (
                    'Get Recommendation'
                  )}
                </button>
              </form>
            </div>

        {/* Results Area */}
        {result && (
          <div className="mt-8 p-8 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-800 text-center animate-fadeIn">
            <div className="inline-block p-4 bg-green-100 dark:bg-green-800/40 rounded-full mb-6 ring-8 ring-green-50 dark:ring-green-900/20">
              <Sprout className="w-12 h-12 text-nature-600 dark:text-nature-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">Recommended Crop</h3>
            <p className="text-4xl font-extrabold text-nature-700 dark:text-nature-400 mb-4">{result.recommendedCrop}</p>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-nature-500"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Confidence Score: {Math.round(result.confidence * 100)}%
              </span>
            </div>
          </div>
        )}

          </div>
        </div>

      </div>
    </div>
    </PageTransition>
  );
};

export default CropRecommendation;
