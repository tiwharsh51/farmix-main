import React, { useState } from 'react';
import { Wind, MapPin, Calendar, Sprout } from 'lucide-react';
import api from '../services/api';
import PageTransition from '../components/PageTransition';

const YieldPrediction = () => {
  const [formData, setFormData] = useState({
    cropType: '',
    area: '',
    season: '',
    state: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const seasons = ['Kharif', 'Rabi', 'Zaid', 'Whole Year'];
  const states = ['Punjab', 'Haryana', 'Uttar Pradesh', 'Maharashtra', 'Madhya Pradesh', 'Andhra Pradesh', 'Tamil Nadu'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await api.post('/yield/predict', formData);
      if(res.data.success) {
        setResult(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to forecast yield. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-nature-100 dark:bg-nature-900/40 rounded-full mb-4">
               <Wind className="h-8 w-8 text-nature-600 dark:text-nature-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Yield Forecasting</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Accurately predict your crop production volume by providing basic farm details. 
              Plan logistics and sales ahead of time.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
            
              {/* Input Form */}
              <div className="p-8 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 font-sans">Farm Details</h2>
                
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-300 p-3 rounded-md text-sm mb-6">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="cropType">
                      <div className="flex items-center gap-2">
                         <Sprout className="w-4 h-4 text-nature-500" />
                         Crop Type
                      </div>
                    </label>
                  <input
                    type="text"
                    name="cropType"
                    id="cropType"
                    required
                    placeholder="e.g. Wheat"
                    value={formData.cropType}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="area">
                      Area (in Hectares)
                    </label>
                    <input
                      type="number"
                      name="area"
                      id="area"
                      required
                      min="0.1"
                      step="0.1"
                      placeholder="e.g. 2.5"
                      value={formData.area}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="season">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-orange-500" />
                          Season
                        </div>
                      </label>
                      <select
                        name="season"
                        id="season"
                        required
                        value={formData.season}
                        onChange={handleChange}
                        className="input-field bg-white dark:bg-gray-700"
                      >
                      <option value="" disabled>Select Season</option>
                      {seasons.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="state">
                         <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-500" />
                          State
                        </div>
                      </label>
                      <select
                        name="state"
                        id="state"
                        required
                        value={formData.state}
                        onChange={handleChange}
                        className="input-field bg-white dark:bg-gray-700"
                      >
                      <option value="" disabled>Select State</option>
                      {states.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 flex justify-center items-center"
                >
                  {loading ? (
                    <span className="animate-pulse">Calculating Forecast...</span>
                  ) : (
                    'Predict Yield'
                  )}
                </button>
              </form>
            </div>

              {/* Results Area */}
              <div className="p-8 bg-gray-50 dark:bg-gray-800 flex flex-col justify-center min-h-[400px]">
                {result ? (
                  <div className="text-center animate-fadeIn">
                    <div className="inline-block p-4 bg-orange-100 dark:bg-orange-900/40 rounded-full mb-6 ring-8 ring-orange-50 dark:ring-orange-900/20">
                      <Wind className="w-12 h-12 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">Estimated Yield</h3>
                    <p className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">{result.estimatedYield}</p>
                    
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-nature-500"></div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Accuracy Model Score: {Math.round(result.confidence * 100)}%
                      </span>
                    </div>
                    
                    <p className="mt-8 text-sm text-gray-500 dark:text-gray-400 px-6">
                    Predictions are baseline estimates. Actual yields may vary due to sudden weather shifts or pest infestations.
                  </p>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <Wind className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">Submit details to forecast your crop yield.</p>
                </div>
              )}
            </div>

          </div>
        </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default YieldPrediction;
