import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, Sprout, Wind, Users, ShieldCheck, Banknote, 
  Mail, Phone, MapPin, Send, MessageCircle 
} from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import PageTransition from '../components/PageTransition';
import api from '../services/api';
import { toast } from 'react-toastify';

const Home = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/messages', formData);
      if (res.data.success) {
        toast.success('Message sent successfully! Our team will contact you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    // ... existing features
    {
      icon: Sprout,
      title: 'Smart Crop Monitoring',
      description: 'Real-time monitoring and data-driven recommendations for optimal crop selection and growth strategies.',
      linkTo: '/crop-recommendation',
      linkText: 'Check recommendations',
      highlight: true
    },
    {
      icon: ShieldCheck,
      title: 'Disease Prediction',
      description: 'AI-powered leaf disease detection to catch issues before they spread and protect your harvest yield.',
      linkTo: '/disease-prediction',
      linkText: 'Upload image'
    },
    {
      icon: Wind,
      title: 'Yield Forecasting',
      description: 'Analyze soil, weather, and farm parameters to accurately predict production volumes and plan logistics.',
      linkTo: '/yield-prediction',
      linkText: 'Forecast yield'
    },
    {
      icon: Users,
      title: 'Farmers Community',
      description: 'Connect with local farmers, agronomists, and experts to share knowledge and discuss modern techniques.',
      linkTo: '/community',
      linkText: 'Join discussion'
    },
     {
      icon: Banknote,
      title: 'Marketplace Integration',
      description: 'Direct access to buyers and suppliers, skipping middlemen to maximize your profit and lower input costs.',
      linkTo: '/login',
      linkText: 'Manage trade'
    }
  ];

  return (
    <PageTransition>
      <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img 
             src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
             alt="Agriculture Farm" 
             className="w-full h-full object-cover opacity-30 transform scale-105 transition-transform duration-[20s] ease-out hover:scale-100"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900"></div>
           <div className="absolute inset-0 bg-gradient-to-r from- nature-900/50 to-transparent mix-blend-multiply"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center">
          <div className="animate-fade-in-up">
            <span className="inline-block py-1.5 px-4 rounded-full bg-nature-500/20 backdrop-blur-sm border border-nature-400/30 text-nature-300 text-sm font-bold tracking-widest mb-8 shadow-[0_0_15px_rgba(100,162,128,0.2)]">
              REVOLUTIONIZING AGRICULTURE
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 animate-fade-in-up animation-delay-100 drop-shadow-lg">
            Empowering India's <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nature-400 to-green-300 drop-shadow-none">
              Farming Future
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-300 mb-12 max-w-3xl leading-relaxed animate-fade-in-up animation-delay-200">
            AgriTech connects Farmers, Buyers, and Agronomists through smart ML solutions to revolutionize the agricultural ecosystem with data-driven insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up animation-delay-300">
            <Link to="/register" className="btn-primary text-center text-lg px-10 py-4 shadow-[0_0_20px_rgba(67,134,99,0.4)]">
              Get Started Free
            </Link>
            <Link to="/crop-recommendation" className="glass-panel text-white hover:bg-white/10 text-center text-lg px-10 py-4 rounded-xl font-semibold transition-all duration-300">
              Explore Tools
            </Link>
          </div>
        </div>
        
        {/* Floating elements backdrop */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-nature-500 rounded-full mix-blend-screen filter blur-[80px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-green-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30"></div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
              Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-nature-500 to-green-600">Platform Features</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Tailored tools and services for every stakeholder in the agricultural value chain. 
              Explore targeted benefits to maximize your yield and profits.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-24 bg-white dark:bg-gray-800 relative transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Contact Info */}
            <div className="animate-fade-in-up">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                Get in <span className="text-nature-600 dark:text-nature-400">Touch</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
                Have questions about our smart farming tools or want to collaborate? 
                Our team is here to support your agricultural journey.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-nature-100 dark:bg-nature-900/40 rounded-xl text-nature-600 dark:text-nature-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Email Us</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">harshittiw766@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-nature-100 dark:bg-nature-900/40 rounded-xl text-nature-600 dark:text-nature-400">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Call Us</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">+91 70801 45353</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-nature-100 dark:bg-nature-900/40 rounded-xl text-nature-600 dark:text-nature-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Visit Us</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Lucknow, Uttar Pradesh, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-fade-in-up animation-delay-200">
              <div className="card p-8 bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <MessageCircle className="w-24 h-24 text-nature-600" />
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Subject</label>
                    <input 
                      type="text" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help?"
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Message</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Your message here..."
                      className="input-field min-h-[120px]"
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(67,134,99,0.3)] transition-all"
                  >
                    {loading ? 'Sending...' : <><Send className="w-5 h-5" /> Send Message</>}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-nature-800 to-nature-900"></div>
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center opacity-10">
           <svg className="w-full h-full text-white" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0,100 C20,0 50,0 100,100 Z" fill="currentColor"/>
           </svg>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight">Ready to transform your harvest?</h2>
          <p className="text-xl text-nature-100/90 mb-12 leading-relaxed">
            Join thousands of successful farmers utilizing machine learning to predict yields, diseases, and optimal crops. Start your smart farming journey today.
          </p>
          <Link to="/register" className="inline-block bg-white text-nature-800 px-10 py-5 rounded-xl font-bold text-xl hover:bg-gray-50 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:-translate-y-1">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
    </PageTransition>
  );
};

export default Home;
