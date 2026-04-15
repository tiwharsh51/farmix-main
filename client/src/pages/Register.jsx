import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sprout, User, ShieldCheck } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      const result = await register(formData.name, formData.email, formData.password, formData.role);
      // Role-based redirect
      navigate(result?.redirectTo || '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 bg-nature-100 dark:bg-nature-900/40 rounded-full flex items-center justify-center mb-4">
              <Sprout className="h-8 w-8 text-nature-600 dark:text-nature-400" />
            </div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Create an account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-nature-600 dark:text-nature-400 hover:text-nature-500">
                Sign in here
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm rounded">
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="name">Full Name</label>
                <input id="name" name="name" type="text" required className="input-field" placeholder="Ramesh Kumar" value={formData.name} onChange={handleChange} />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">Email address</label>
                <input id="email" name="email" type="email" required className="input-field" placeholder="farmer@example.com" value={formData.email} onChange={handleChange} />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">Password</label>
                <input id="password" name="password" type="password" required className="input-field" placeholder="••••••••" value={formData.password} onChange={handleChange} />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="confirmPassword">Confirm Password</label>
                <input id="confirmPassword" name="confirmPassword" type="password" required className="input-field" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
              </div>

              {/* Role Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Are you registering as?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'user' })}
                    className={`flex items-center gap-2 justify-center p-3 rounded-xl border-2 transition-all duration-200 font-medium text-sm
                      ${formData.role === 'user'
                        ? 'border-nature-500 bg-nature-50 dark:bg-nature-900/20 text-nature-700 dark:text-nature-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-nature-300 dark:hover:border-nature-700'
                      }`}
                  >
                    <User className="w-4 h-4" />
                    Farmer / User
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                    className={`flex items-center gap-2 justify-center p-3 rounded-xl border-2 transition-all duration-200 font-medium text-sm
                      ${formData.role === 'admin'
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-700'
                      }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Administrator
                  </button>
                </div>
                {formData.role === 'admin' && (
                  <p className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg px-3 py-2">
                    ⚠️ Admin accounts have full platform control. Only register as Admin if authorised.
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 btn-primary relative disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : `Register as ${formData.role === 'admin' ? 'Administrator' : 'Farmer'}`}
            </button>
          </form>
        </div>
      </div>
    </PageTransition>
  );
};

export default Register;
