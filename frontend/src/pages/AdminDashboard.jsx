import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                // Absolute URL to prevent 404
                const res = await axios.get('http://localhost:5001/api/events/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
            } catch (err) {
                console.error("Dashboard error", err);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <div className="p-20 text-center text-white font-black bg-[#0F172A] min-h-screen">COMPILING STATS...</div>;

    return (
        <div className="min-h-screen bg-[#0F172A] text-white p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 border-b border-slate-800 pb-8">
                    <h1 className="text-5xl font-black italic tracking-tighter uppercase">Platform <span className="text-indigo-500">Analytics</span></h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {[
                        { label: 'Active Events', value: stats.totalEvents, color: 'border-indigo-500' },
                        { label: 'Total Enrolled', value: stats.totalEnrolled, color: 'border-cyan-400' },
                        { label: 'Waitlist Count', value: stats.totalWaitlisted, color: 'border-orange-500' },
                        { label: 'Occupancy', value: `${stats.occupancyRate}%`, color: 'border-emerald-500' }
                    ].map((s, i) => (
                        <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} key={s.label}
                            className={`bg-slate-800/40 p-10 rounded-[2.5rem] border-t-8 ${s.color} shadow-2xl backdrop-blur-md`}>
                            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">{s.label}</p>
                            <h2 className="text-5xl font-black mt-4">{s.value}</h2>
                        </motion.div>
                    ))}
                </div>
                
                {/* ... rest of your UI code remains same */}
            </div>
        </div>
    );
};

export default AdminDashboard;