import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import api from '../services/api';
import PageTransition from '../components/PageTransition';
import SkeletonLoader from '../components/SkeletonLoader';
import WeatherWidget from '../components/WeatherWidget';
import {
  Leaf, Activity, Wind, Sprout, ArrowRight,
  MessageSquare, Users, BarChart2, Shield, UserCheck, Bell, 
  Trash2, Edit2, Check, X
} from 'lucide-react';
import { toast } from 'react-toastify';

const getIconForType = (type) => {
  switch (type) {
    case 'Crop-Recommendation': return <Sprout className="w-5 h-5 text-green-500" />;
    case 'Disease-Prediction': return <Activity className="w-5 h-5 text-red-500" />;
    case 'Yield-Prediction': return <Wind className="w-5 h-5 text-blue-500" />;
    default: return <Leaf className="w-5 h-5 text-gray-500" />;
  }
};

const QuickTool = ({ to, icon: Icon, label, colorClasses }) => (
  <Link
    to={to}
    className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:shadow-sm group ${colorClasses}`}
  >
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-nature-600 dark:text-nature-400" />
      <span className="font-medium text-gray-700 dark:text-gray-200">{label}</span>
    </div>
    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
  </Link>
);

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // { id: string, type: 'root'|'reply', replyId?: string }
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (!user || user.role === 'admin') return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const [historyRes, messagesRes] = await Promise.all([
          api.get('/predictions/history'),
          api.get('/messages/my')
        ]);
        if (historyRes.data.success) setHistory(historyRes.data.data.slice(0, 5));
        if (messagesRes.data.success) setMessages(messagesRes.data.data);
      } catch {
        // non-critical
      } finally {
        setLoading(false);
        setMsgLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message thread?')) return;
    try {
      const res = await api.delete(`/messages/${id}`);
      if (res.data.success) {
        setMessages(prev => prev.filter(m => m._id !== id));
        toast.success('Message deleted');
      }
    } catch { toast.error('Failed to delete message'); }
  };

  const handleDeleteReply = async (msgId, replyId) => {
    if (!window.confirm('Delete this reply?')) return;
    try {
      const res = await api.delete(`/messages/${msgId}/replies/${replyId}`);
      if (res.data.success) {
        setMessages(prev => prev.map(m => m._id === msgId ? res.data.data : m));
        toast.success('Reply deleted');
      }
    } catch { toast.error('Failed to delete reply'); }
  };

  const handleUpdateMessage = async (id) => {
    if (!editValue.trim()) return;
    try {
      const res = await api.put(`/messages/${id}`, { message: editValue });
      if (res.data.success) {
        setMessages(prev => prev.map(m => m._id === id ? res.data.data : m));
        setEditingId(null);
        toast.success('Message updated');
      }
    } catch { toast.error('Failed to update message'); }
  };

  const handleUpdateReply = async (msgId, replyId) => {
    if (!editValue.trim()) return;
    try {
      const res = await api.put(`/messages/${msgId}/replies/${replyId}`, { text: editValue });
      if (res.data.success) {
        setMessages(prev => prev.map(m => m._id === msgId ? res.data.data : m));
        setEditingId(null);
        toast.success('Reply updated');
      }
    } catch { toast.error('Failed to update reply'); }
  };

  // Guard AFTER all hooks
  if (user?.role === 'admin') return <Navigate to="/admin-dashboard" replace />;

  return (
    <PageTransition>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Header Section */}
          <div className="relative mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Welcome back, <span className="text-nature-600 dark:text-nature-400">{user?.name || 'Farmer'}</span> 🌾
              </h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 font-medium">
                Here's what's happening on your farm today.
              </p>
            </div>
          </div>

          {/* Hero Stats Section - Premium Command Center Style */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Total Predictions', value: history.length, icon: BarChart2, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Recent Messages', value: messages.length, icon: MessageSquare, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'Unread Replies', value: messages.filter(m => !m.isRead).length, icon: Bell, color: 'text-red-600', bg: 'bg-red-50' },
              { label: 'Active Tasks', value: '5+', icon: Shield, color: 'text-nature-600', bg: 'bg-nature-50' }
            ].map((stat, i) => (
              <div key={i} className="card p-5 border-none shadow-sm flex flex-col items-center text-center hover:scale-105 transition-transform">
                <div className={`p-3 rounded-2xl ${stat.bg} mb-3`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mt-1">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            
            {/* Left Column (Weather & Tools) */}
            <div className="lg:col-span-1 space-y-8">
              <div className="transform hover:scale-[1.02] transition-transform duration-300">
                <WeatherWidget />
              </div>

              {/* Quick Tools - Refined Grid */}
              <div className="card p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-nature-500/10 rounded-full blur-2xl group-hover:bg-nature-500/20 transition-colors"></div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-nature-600" />
                  Quick Tools
                </h2>
                <div className="space-y-4">
                  <QuickTool to="/crop-recommendation" icon={Sprout} label="Crop Analysis" colorClasses="bg-nature-50/50 hover:bg-nature-100 dark:bg-gray-800 dark:hover:bg-gray-700/50 border border-nature-100/50 dark:border-nature-900/30" />
                  <QuickTool to="/disease-prediction" icon={Activity} label="Disease Scan" colorClasses="bg-red-50/50 hover:bg-red-100 dark:bg-gray-800 dark:hover:bg-gray-700/50 border border-red-100/50 dark:border-red-900/30" />
                  <QuickTool to="/yield-prediction" icon={Wind} label="Yield Forecast" colorClasses="bg-blue-50/50 hover:bg-blue-100 dark:bg-gray-800 dark:hover:bg-gray-700/50 border border-blue-100/50 dark:border-blue-900/30" />
                  <QuickTool to="/community" icon={Users} label="Community" colorClasses="bg-orange-50/50 hover:bg-orange-100 dark:bg-gray-800 dark:hover:bg-gray-700/50 border border-orange-100/50 dark:border-orange-900/30" />
                  <QuickTool to="/farm-map" icon={Leaf} label="Farm Map" colorClasses="bg-emerald-50/50 hover:bg-emerald-100 dark:bg-gray-800 dark:hover:bg-gray-700/50 border border-emerald-100/50 dark:border-emerald-900/30" />
                  <QuickTool to="/market-prediction" icon={BarChart2} label="Market Prices" colorClasses="bg-purple-50/50 hover:bg-purple-100 dark:bg-gray-800 dark:hover:bg-gray-700/50 border border-purple-100/50 dark:border-purple-900/30" />
                </div>
              </div>
            </div>

            {/* Right Column (Tools & Predictions) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Prediction History - Enhanced Design */}
              <div className="card p-7">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100 dark:border-gray-700">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                    <p className="text-sm text-gray-500 mt-1">Track your recent farming insights.</p>
                  </div>
                  <Link to="/analytics" className="px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-sm font-bold text-nature-600 dark:text-nature-400 transition-colors">
                    View Analytics
                  </Link>
                </div>
                
                {loading ? (
                  <div className="p-4 space-y-4">
                    <SkeletonLoader type="text" count={3} />
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50/50 dark:bg-gray-800/30 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 shadow-sm flex items-center justify-center">
                      <Leaf className="w-8 h-8 text-nature-300 dark:text-gray-600" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No activity yet. Let's start with a prediction!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((item, idx) => (
                      <div key={item._id} className="group relative flex items-center justify-between p-5 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:bg-nature-50 dark:hover:bg-gray-700/50 transition-all duration-300 hover:shadow-md">
                        <div className="flex items-center gap-5">
                          <div className="p-3 rounded-xl bg-white dark:bg-gray-700 shadow-sm transition-transform group-hover:scale-110">
                            {getIconForType(item.type)}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white capitalize text-lg tracking-tight">
                              {item.type.replace('-', ' ')}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400 font-medium">
                              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                           <span className="text-sm font-black text-nature-700 dark:text-nature-400">
                             {item.type === 'Crop-Recommendation' ? item.predictionResult?.recommendedCrop :
                              item.type === 'Disease-Prediction' ? (item.predictionResult?.disease || item.predictionResult?.diseaseName) :
                              item.type === 'Yield-Prediction' ? `${item.predictionResult?.estimatedYield} t/ha` : 'Analyzed'}
                           </span>
                           <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-nature-500 transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Community CTA - Premium Banner */}
              <div className="relative card p-8 border-none bg-nature-600 dark:bg-nature-900 group overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
                <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                  <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-2xl font-black text-white tracking-tight">AgriTech Community</h3>
                    <p className="text-white/80 font-medium mt-1">Connect with 10,000+ farmers across the globe.</p>
                  </div>
                  <Link to="/community" className="bg-white text-nature-600 px-8 py-3 rounded-xl font-black hover:bg-gray-100 transition-colors shadow-lg active:scale-95">
                    Enter Community
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Full-width interactive Support Inbox - Refined Layout */}
          <div className="mt-16">
            <div className="card border-none shadow-xl overflow-hidden ring-1 ring-gray-100 dark:ring-gray-800">
              <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/40 rounded-xl">
                    <MessageSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Support Workspace</h2>
                    <p className="text-sm text-gray-500 font-medium italic">Direct dialogue with management.</p>
                  </div>
                </div>
                {messages.some(m => !m.isRead) && (
                  <span className="px-4 py-1.5 bg-red-100 text-red-600 text-xs font-black rounded-full shadow-sm animate-pulse flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    ACTION REQUIRED
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 h-[500px]">
                {/* Conversations List */}
                <div className="md:col-span-4 border-r border-gray-100 dark:border-gray-800 overflow-y-auto custom-scrollbar bg-gray-50/20 dark:bg-gray-900/10">
                  {msgLoading ? (
                    <div className="p-6 space-y-4"><SkeletonLoader type="text" count={4} /></div>
                  ) : messages.length === 0 ? (
                    <div className="p-16 text-center text-gray-400 italic font-medium">No history found</div>
                  ) : (
                    messages.map(msg => (
                      <button 
                        key={msg._id}
                        className={`w-full text-left p-5 border-b border-gray-100 dark:border-gray-800 hover:bg-white dark:hover:bg-gray-800 transition-all relative group`}
                      >
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <span className={`font-black text-[11px] uppercase tracking-tight ${!msg.isRead ? 'text-nature-600 dark:text-nature-400' : 'text-gray-400'}`}>
                            {msg.subject}
                          </span>
                          <span className="text-[10px] font-bold text-gray-300">{new Date(msg.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 font-medium">{msg.message}</p>
                        {!msg.isRead && <div className="absolute left-0 top-4 bottom-4 w-1 bg-nature-500 rounded-r-full"></div>}
                      </button>
                    ))
                  )}
                </div>

                {/* Active Chat View */}
                <div className="md:col-span-8 flex flex-col bg-[#e5ddd5] dark:bg-gray-900/40 relative">
                  {/* WhatsApp Background Overlay (Subtle) */}
                  <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03] pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat"></div>
                  
                  {messages.length > 0 ? (
                    <>
                      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar relative z-10">
                        {messages.map(msg => (
                          <div key={msg._id} className="space-y-4">
                            {/* User Message - WhatsApp Style */}
                            <div className="flex justify-end">
                              <div className="max-w-[85%] bg-[#dcf8c6] dark:bg-nature-900/60 text-gray-800 dark:text-gray-100 p-3.5 rounded-2xl rounded-tr-none shadow-sm relative group whatsapp-tail-right">
                                {editingId?.id === msg._id && editingId?.type === 'root' ? (
                                  <div className="flex flex-col gap-2 min-w-[200px]">
                                    <textarea 
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      className="w-full bg-white/50 dark:bg-black/20 rounded-lg p-2 text-sm outline-none border border-nature-500/30"
                                      rows={2}
                                    />
                                    <div className="flex justify-end gap-2">
                                      <button onClick={() => setEditingId(null)} className="p-1 hover:bg-red-100 rounded text-red-500"><X className="w-4 h-4" /></button>
                                      <button onClick={() => handleUpdateMessage(msg._id)} className="p-1 hover:bg-green-100 rounded text-green-600"><Check className="w-4 h-4" /></button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <p className="text-sm leading-relaxed font-medium pr-12">{msg.message}</p>
                                    <div className="message-actions">
                                      <button 
                                        onClick={() => { setEditingId({ id: msg._id, type: 'root' }); setEditValue(msg.message); }}
                                        className="p-1 hover:text-nature-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                                      <button 
                                        onClick={() => handleDeleteMessage(msg._id)}
                                        className="p-1 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                  </>
                                )}
                                <div className="absolute bottom-1 right-2 flex items-center gap-1">
                                  <span className="text-[9px] font-bold opacity-40 uppercase">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  <div className="flex -space-x-1">
                                    <div className="w-2.5 h-2.5 rounded-full border border-nature-500 bg-nature-500/20"></div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Replies */}
                            {msg.replies?.map((reply, idx) => (
                              <div key={idx} className={`flex ${reply.senderRole === 'admin' ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[85%] p-3.5 rounded-2xl shadow-sm relative border group
                                  ${reply.senderRole === 'admin' 
                                    ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-tl-none border-gray-100 dark:border-gray-700 whatsapp-tail-left' 
                                    : 'bg-[#dcf8c6] dark:bg-nature-900/60 text-gray-800 dark:text-gray-100 rounded-tr-none border-transparent whatsapp-tail-right'}`}>
                                  
                                  {reply.senderRole === 'admin' && (
                                    <p className="text-[10px] font-black text-indigo-500 mb-1 uppercase tracking-wider">Support Agent</p>
                                  )}

                                  {editingId?.replyId === reply._id ? (
                                    <div className="flex flex-col gap-2 min-w-[200px]">
                                      <textarea 
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="w-full bg-white/50 dark:bg-black/20 rounded-lg p-2 text-sm outline-none border border-nature-500/30"
                                        rows={2}
                                      />
                                      <div className="flex justify-end gap-2">
                                        <button onClick={() => setEditingId(null)} className="p-1 hover:bg-red-100 rounded text-red-500"><X className="w-4 h-4" /></button>
                                        <button onClick={() => handleUpdateReply(msg._id, reply._id)} className="p-1 hover:bg-green-100 rounded text-green-600"><Check className="w-4 h-4" /></button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <p className="text-sm leading-relaxed font-medium pr-12">{reply.text}</p>
                                      {/* Only owner (user) can edit/delete their replies here. Admin dashboard will have its own. */}
                                      {reply.senderRole === 'user' && (
                                        <div className="message-actions">
                                          <button 
                                            onClick={() => { setEditingId({ id: msg._id, type: 'reply', replyId: reply._id }); setEditValue(reply.text); }}
                                            className="p-1 hover:text-nature-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                                          <button 
                                            onClick={() => handleDeleteReply(msg._id, reply._id)}
                                            className="p-1 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                      )}
                                    </>
                                  )}
                                  
                                  <span className="absolute bottom-1 right-2 text-[9px] font-bold opacity-40 uppercase">
                                    {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </div>
                            ))}

                            {/* Sticky Reply Bar - Refined like Mobile */}
                            <div className="sticky bottom-0 pt-4 pb-2 z-20">
                              <form 
                                onSubmit={async (e) => {
                                  e.preventDefault();
                                  const text = e.target.reply.value;
                                  if (!text.trim()) return;
                                  try {
                                    const res = await api.put(`/messages/${msg._id}/user-reply`, { message: text });
                                    if (res.data.success) {
                                      setMessages(prev => prev.map(m => m._id === msg._id ? res.data.data : m));
                                      e.target.reply.value = '';
                                    }
                                  } catch (err) { console.error('Reply failed', err); }
                                }}
                                className="flex gap-2 items-center px-2"
                              >
                                <div className="flex-1 relative">
                                  <input 
                                    name="reply"
                                    placeholder="Type a message..."
                                    className="w-full bg-white dark:bg-gray-800 border-none rounded-full px-6 py-3 text-sm shadow-md focus:ring-2 focus:ring-nature-500/20 outline-none dark:text-white placeholder-gray-400 font-medium"
                                  />
                                </div>
                                <button className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-nature-600 text-white rounded-full hover:bg-nature-700 transition-all shadow-lg active:scale-95 group">
                                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              </form>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-16 text-center">
                      <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 ring-8 ring-gray-100 dark:ring-gray-900/50">
                        <MessageSquare className="w-10 h-10 text-gray-200" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Workspace Inactive</h3>
                      <p className="text-sm text-gray-400 max-w-xs font-medium leading-relaxed">Need help? Send a message via the Home Page contact form to start a dialogue.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserDashboard;
