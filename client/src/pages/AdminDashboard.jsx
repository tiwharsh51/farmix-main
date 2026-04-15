import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../services/api';
import PageTransition from '../components/PageTransition';
import SkeletonLoader from '../components/SkeletonLoader';
import {
  Users, Trash2, Shield, Activity, BarChart2,
  MessageSquare, Sprout, RefreshCw, Crown, UserCheck, AlertTriangle,
  Mail, Send, Edit2, Check, X
} from 'lucide-react';
import { toast } from 'react-toastify';

// Reusable stat card
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className={`card p-6 border-t-4 ${color} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color.replace('border-', 'bg-').replace('-500', '-100 dark:bg-opacity-20')}`}>
        <Icon className={`w-6 h-6 ${color.replace('border-', 'text-').replace('-500', '-600 dark:text-').concat(color.split('-')[1] + '-400')}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value ?? '—'}</p>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [deletingId, setDeletingId] = useState(null);
  const [updatingRoleId, setUpdatingRoleId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyingId, setReplyingId] = useState(null);
  const [editingId, setEditingId] = useState(null); // { id: string, type: 'reply', replyId: string }
  const [editValue, setEditValue] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, postsRes, statsRes, messagesRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/posts'),
        api.get('/admin/stats'),
        api.get('/messages'),
      ]);
      setUsers(usersRes.data.data || []);
      setPosts(postsRes.data.data || []);
      setStats(statsRes.data.data || null);
      setMessages(messagesRes.data.data || []);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReplyMessage = async (msgId) => {
    if (!replyText.trim()) return;
    setReplyingId(msgId);
    try {
      const res = await api.put(`/messages/${msgId}/reply`, { reply: replyText });
      if (res.data.success) {
        setMessages(prev => prev.map(m => m._id === msgId ? res.data.data : m));
        toast.success('Reply sent successfully');
        setReplyText('');
      }
    } catch {
      toast.error('Failed to send reply');
    } finally {
      setReplyingId(null);
    }
  };

  useEffect(() => { fetchData(); }, [fetchData]);

  // Guard AFTER all hooks — non-admins redirected to /user-dashboard
  if (!user || user.role !== 'admin') return <Navigate to="/user-dashboard" replace />;

  const handleDeletePost = async (postId, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    setDeletingId(postId);
    try {
      await api.delete(`/admin/post/${postId}`);
      setPosts(prev => prev.filter(p => p._id !== postId));
      toast.success('Post removed');
    } catch {
      toast.error('Failed to remove post');
    } finally {
      setDeletingId(null);
    }
  };

  const handleRoleChange = async (userId, newRole, name) => {
    if (!window.confirm(`Change ${name}'s role to "${newRole}"?`)) return;
    setUpdatingRoleId(userId);
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success(`${name} is now ${newRole}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update role');
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'posts', label: 'Posts', icon: MessageSquare, count: posts.length },
    { id: 'users', label: 'Users', icon: Users, count: users.length },
    { id: 'messages', label: 'Messages', icon: Mail, count: messages.filter(m => !m.isRead).length },
  ];

  return (
    <PageTransition>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl">
                <Shield className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Logged in as {user.name} · Administrator</p>
              </div>
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 btn-outline py-2 px-4 text-sm self-start sm:self-auto"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-8 w-fit">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count != null && (
                  <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs px-1.5 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <SkeletonLoader type="card" count={4} />
          ) : (
            <div className="space-y-8">

              {/* ── OVERVIEW ── */}
              {activeTab === 'overview' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <StatCard icon={Users} label="Total Users" value={stats?.totalUsers} color="border-indigo-500" />
                    <StatCard icon={MessageSquare} label="Community Posts" value={stats?.totalPosts} color="border-orange-500" />
                    <StatCard icon={Activity} label="Total Predictions" value={stats?.totalPredictions} color="border-nature-500" />
                    <StatCard icon={Sprout} label="Crop Analyses" value={stats?.predictionBreakdown?.cropRecommendations} color="border-emerald-500" />
                  </div>

                  {/* Prediction Breakdown */}
                  <div className="card p-6">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                      <BarChart2 className="w-5 h-5 text-indigo-500" /> Prediction Breakdown
                    </h2>
                    <div className="space-y-3">
                      {[
                        { label: 'Crop Recommendations', value: stats?.predictionBreakdown?.cropRecommendations || 0, color: 'bg-emerald-500' },
                        { label: 'Disease Predictions', value: stats?.predictionBreakdown?.diseasePredictions || 0, color: 'bg-red-500' },
                        { label: 'Yield Predictions', value: stats?.predictionBreakdown?.yieldPredictions || 0, color: 'bg-blue-500' },
                      ].map(item => {
                        const pct = stats?.totalPredictions > 0 ? Math.round((item.value / stats.totalPredictions) * 100) : 0;
                        return (
                          <div key={item.label}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-700 dark:text-gray-300 font-medium">{item.label}</span>
                              <span className="text-gray-500 dark:text-gray-400">{item.value} ({pct}%)</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                              <div className={`${item.color} h-2 rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Activity Feed */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card p-6">
                      <h2 className="text-base font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-indigo-500" /> Recent Posts
                      </h2>
                      <div className="space-y-2">
                        {(stats?.recentPosts || []).map(p => (
                          <div key={p._id} className="flex items-start justify-between gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{p.title}</p>
                              <p className="text-xs text-gray-400">by {p.author?.name || 'Unknown'}</p>
                            </div>
                            <button onClick={() => handleDeletePost(p._id, p.title)} disabled={deletingId === p._id}
                              className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 p-1 disabled:opacity-50">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {!stats?.recentPosts?.length && <p className="text-sm text-gray-400">No posts yet.</p>}
                      </div>
                    </div>
                    <div className="card p-6">
                      <h2 className="text-base font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-indigo-500" /> New Users
                      </h2>
                      <div className="space-y-2">
                        {(stats?.recentUsers || []).map(u => (
                          <div key={u._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                              {u.name[0].toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{u.name}</p>
                              <p className="text-xs text-gray-400 truncate">{u.email}</p>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0
                              ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                              {u.role}
                            </span>
                          </div>
                        ))}
                        {!stats?.recentUsers?.length && <p className="text-sm text-gray-400">No users yet.</p>}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ── POSTS TAB ── */}
              {activeTab === 'posts' && (
                <div className="card p-6">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-indigo-500" /> All Posts
                    <span className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs px-2 py-0.5 rounded-full">{posts.length}</span>
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Title</th>
                          <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Author</th>
                          <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300 text-center">Likes</th>
                          <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300 text-center">Comments</th>
                          <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Date</th>
                          <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {posts.map(post => (
                          <tr key={post._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                            <td className="py-3 px-4 text-gray-800 dark:text-gray-200 max-w-[200px] truncate">{post.title}</td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{post.author?.name || 'Unknown'}</td>
                            <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">{post.likes?.length || 0}</td>
                            <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">{post.comments?.length || 0}</td>
                            <td className="py-3 px-4 text-gray-500 text-xs whitespace-nowrap">{new Date(post.createdAt).toLocaleDateString()}</td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleDeletePost(post._id, post.title)}
                                disabled={deletingId === post._id}
                                className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 border border-red-200 dark:border-red-800 rounded-lg px-2 py-1 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
                              >
                                {deletingId === post._id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <><Trash2 className="w-3 h-3" /> Delete</>}
                              </button>
                            </td>
                          </tr>
                        ))}
                        {!posts.length && <tr><td colSpan={6} className="py-8 text-center text-gray-400">No posts found.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── USERS TAB ── */}
              {activeTab === 'users' && (
                <div className="card p-6">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-500" /> Registered Users
                    <span className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs px-2 py-0.5 rounded-full">{users.length}</span>
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Name</th>
                          <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Email</th>
                          <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Role</th>
                          <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Joined</th>
                          <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                                  ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400' : 'bg-nature-100 text-nature-700 dark:bg-nature-900/30 dark:text-nature-400'}`}>
                                  {u.name[0].toUpperCase()}
                                </div>
                                <span className="font-medium text-gray-800 dark:text-gray-200">{u.name}</span>
                                {u.role === 'admin' && <Crown className="w-3 h-3 text-indigo-500" />}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{u.email}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 text-xs rounded-full font-medium
                                ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                            <td className="py-3 px-4 text-center">
                              {u._id !== user._id ? (
                                <button
                                  onClick={() => handleRoleChange(u._id, u.role === 'admin' ? 'user' : 'admin', u.name)}
                                  disabled={updatingRoleId === u._id}
                                  className={`inline-flex items-center gap-1 text-xs border rounded-lg px-2 py-1 transition-all disabled:opacity-50
                                    ${u.role === 'admin'
                                      ? 'text-orange-600 border-orange-200 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-900/20'
                                      : 'text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:border-indigo-800 dark:hover:bg-indigo-900/20'}`}
                                >
                                  {updatingRoleId === u._id
                                    ? <RefreshCw className="w-3 h-3 animate-spin" />
                                    : u.role === 'admin' ? <><AlertTriangle className="w-3 h-3" /> Revoke</> : <><Crown className="w-3 h-3" /> Promote</>}
                                </button>
                              ) : (
                                <span className="text-xs text-gray-400 italic">You</span>
                              )}
                            </td>
                          </tr>
                        ))}
                        {!users.length && <tr><td colSpan={5} className="py-8 text-center text-gray-400">No users found.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── MESSAGES TAB ── */}
              {activeTab === 'messages' && (
                <div className="card border-none shadow-xl overflow-hidden ring-1 ring-gray-100 dark:ring-gray-800">
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/40 rounded-lg">
                        <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-800 dark:text-white">Support Workspace</h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 h-[600px]">
                    {/* Inquiries List */}
                    <div className="md:col-span-4 border-r border-gray-100 dark:border-gray-800 overflow-y-auto custom-scrollbar bg-gray-50/20 dark:bg-gray-900/10">
                      {messages.length === 0 ? (
                        <div className="p-10 text-center text-gray-400 italic font-medium">No history found</div>
                      ) : (
                        messages.map(msg => (
                          <button 
                            key={msg._id}
                            onClick={() => {
                              setReplyingId(msg._id);
                              if (!msg.isRead) api.put(`/messages/${msg._id}/read`);
                            }}
                            className={`w-full text-left p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-white dark:hover:bg-gray-800 transition-all relative group
                              ${replyingId === msg._id ? 'bg-white dark:bg-gray-800 ring-2 ring-inset ring-indigo-500/20' : ''}`}
                          >
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <span className="font-black text-[11px] uppercase tracking-tight text-gray-900 dark:text-white truncate">{msg.name}</span>
                              <span className="text-[10px] font-bold text-gray-300">{new Date(msg.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">{msg.subject}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 font-medium">{msg.message}</p>
                            {!msg.isRead && <div className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-500 rounded-r-full"></div>}
                          </button>
                        ))
                      )}
                    </div>

                    {/* Active Chat View */}
                    <div className="md:col-span-8 flex flex-col bg-[#e5ddd5] dark:bg-gray-900/40 relative">
                      <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03] pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat"></div>
                      
                      {replyingId ? (
                        <>
                          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar relative z-10">
                            {messages.filter(m => m._id === replyingId).map(msg => (
                              <div key={msg._id} className="space-y-4">
                                {/* Root Message */}
                                <div className="flex justify-start">
                                  <div className="max-w-[85%] bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3.5 rounded-2xl rounded-tl-none shadow-sm relative whatsapp-tail-left border border-gray-100 dark:border-gray-700">
                                    <p className="text-[10px] font-black text-nature-600 mb-1 uppercase tracking-wider">{msg.name}</p>
                                    <p className="text-sm leading-relaxed font-medium pr-10">{msg.message}</p>
                                    <span className="absolute bottom-1 right-2 text-[9px] font-bold opacity-40 uppercase">
                                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                </div>

                                {/* Replies Thread */}
                                {msg.replies?.map((reply, idx) => (
                                  <div key={idx} className={`flex ${reply.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3.5 rounded-2xl shadow-sm relative border group
                                      ${reply.senderRole === 'admin' 
                                        ? 'bg-[#dcf8c6] dark:bg-indigo-900/60 text-gray-800 dark:text-gray-100 rounded-tr-none border-transparent whatsapp-tail-right' 
                                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-tl-none border-gray-100 dark:border-gray-700 whatsapp-tail-left'}`}>
                                      
                                      {reply.senderRole === 'user' && (
                                        <p className="text-[10px] font-black text-nature-600 mb-1 uppercase tracking-wider">User</p>
                                      )}

                                      {editingId?.replyId === reply._id ? (
                                        <div className="flex flex-col gap-2 min-w-[200px]">
                                          <textarea 
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="w-full bg-white/50 dark:bg-black/20 rounded-lg p-2 text-sm outline-none border border-indigo-500/30 font-medium"
                                            rows={2}
                                          />
                                          <div className="flex justify-end gap-2">
                                            <button onClick={() => setEditingId(null)} className="p-1 hover:bg-red-100 rounded text-red-500"><X className="w-4 h-4" /></button>
                                            <button 
                                              onClick={async () => {
                                                if (!editValue.trim()) return;
                                                try {
                                                  const res = await api.put(`/messages/${msg._id}/replies/${reply._id}`, { text: editValue });
                                                  if (res.data.success) {
                                                    setMessages(prev => prev.map(m => m._id === msg._id ? res.data.data : m));
                                                    setEditingId(null);
                                                    toast.success('Reply updated');
                                                  }
                                                } catch { toast.error('Edit failed'); }
                                              }} 
                                              className="p-1 hover:bg-green-100 rounded text-green-600"><Check className="w-4 h-4" /></button>
                                          </div>
                                        </div>
                                      ) : (
                                        <>
                                          <p className="text-sm leading-relaxed font-medium pr-10">{reply.text}</p>
                                          {reply.senderRole === 'admin' && (
                                            <div className="message-actions">
                                              <button 
                                                onClick={() => { setEditingId({ id: msg._id, type: 'reply', replyId: reply._id }); setEditValue(reply.text); }}
                                                className="p-1 hover:text-indigo-600 transition-colors"><Edit2 className="w-3" /></button>
                                              <button 
                                                onClick={async () => {
                                                  if (!window.confirm('Delete your reply?')) return;
                                                  try {
                                                    const res = await api.delete(`/messages/${msg._id}/replies/${reply._id}`);
                                                    if (res.data.success) {
                                                      setMessages(prev => prev.map(m => m._id === msg._id ? res.data.data : m));
                                                      toast.success('Reply deleted');
                                                    }
                                                  } catch { toast.error('Delete failed'); }
                                                }}
                                                className="p-1 hover:text-red-600 transition-colors"><Trash2 className="w-3" /></button>
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
                              </div>
                            ))}
                          </div>

                          {/* Chat Footer */}
                          <div className="p-4 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm z-20 flex gap-2 items-center">
                            <textarea 
                              placeholder="Type a reply..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="flex-1 bg-white dark:bg-gray-700 border-none rounded-xl px-4 py-3 text-sm shadow-sm outline-none resize-none min-h-[48px] max-h-[150px] font-medium"
                              rows={1}
                            />
                            <button 
                              onClick={() => handleReplyMessage(replyingId)}
                              disabled={!replyText.trim()}
                              className="w-12 h-12 flex-shrink-0 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg active:scale-95 disabled:opacity-50 group"
                            >
                              <Send className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-16 text-center">
                          <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 ring-8 ring-gray-100/50 dark:ring-gray-900/30">
                            <Mail className="w-10 h-10 text-indigo-300" />
                          </div>
                          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Select a Dialogue</h3>
                          <p className="text-sm text-gray-500 font-medium max-w-xs leading-relaxed">Choose an inquiry from the left panel to engage with the user in our unified workspace.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
