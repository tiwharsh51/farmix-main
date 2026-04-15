import React from 'react';
import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-nature-900 justify-self-end text-white pt-12 pb-8 border-t border-nature-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="col-span-1 md:col-span-1 border-b md:border-b-0 border-nature-700 pb-6 md:pb-0">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Leaf className="h-8 w-8 text-nature-300" />
              <span className="font-bold text-xl tracking-tight">AGRITECH</span>
            </Link>
            <p className="text-nature-200 text-sm">
              Empowering India's Farming Future with innovative technology connecting every stakeholder in the agricultural ecosystem.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-nature-100 placeholder-white">Quick Links</h3>
            <ul className="space-y-2 text-sm text-nature-200">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/community" className="hover:text-white transition-colors">Community Forum</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-nature-100">Services</h3>
            <ul className="space-y-2 text-sm text-nature-200">
              <li><Link to="/crop-recommendation" className="hover:text-white transition-colors">Crop Recommendation</Link></li>
              <li><Link to="/disease-prediction" className="hover:text-white transition-colors">Disease Prediction</Link></li>
              <li><Link to="/yield-prediction" className="hover:text-white transition-colors">Yield Prediction</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-nature-100">Contact</h3>
            <ul className="space-y-2 text-sm text-nature-200">
              <li><a href="mailto:contact@agritech.com" className="hover:text-white transition-colors">harshittiw766@gmail.com</a></li>
              <li><a href="tel:+910000000000" className="hover:text-white transition-colors">+91 7080145353</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-nature-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-nature-300">
          <p>&copy; {new Date().getFullYear()} AgriTech. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
