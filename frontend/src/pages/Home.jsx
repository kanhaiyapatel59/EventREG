import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        axios.get('http://localhost:5001/api/events')
            .then(res => setEvents(res.data))
            .catch(() => console.error("Failed to fetch events"));
    }, []);

    const categories = ['All', 'Tech', 'Music', 'Business', 'Sports', 'Art', 'Other'];

    const filteredEvents = events.filter(e =>
        (selectedCategory === 'All' || e.category === selectedCategory) &&
        e.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* HERO */}
            <div className="relative bg-slate-900 py-24 px-6 overflow-hidden">
                <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
                    className="relative z-10 max-w-4xl mx-auto text-center">
                    <h1 className="text-6xl font-black text-white mb-6">
                        Experience <span className="text-indigo-400">Everything</span>
                    </h1>
                    <input
                        placeholder="Search events..."
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full max-w-xl mx-auto px-6 py-4 rounded-2xl bg-white/10 text-white outline-none"
                    />
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-14">
                {/* CATEGORY FILTER */}
                <div className="flex flex-wrap gap-3 justify-center mb-14">
                    {categories.map(cat => (
                        <button key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-3 rounded-xl font-bold ${
                                selectedCategory === cat
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-slate-600'
                            }`}>
                            {cat}
                        </button>
                    ))}
                </div>

                {/* EVENTS GRID */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filteredEvents.map(event => (
                            <motion.div key={event._id}
                                initial={{opacity:0,scale:0.9}}
                                animate={{opacity:1,scale:1}}
                                exit={{opacity:0,scale:0.9}}
                                className="bg-white rounded-[2rem] shadow hover:shadow-2xl transition overflow-hidden">

                                <div className="relative h-60">
                                    <img src={event.image} className="w-full h-full object-cover" />

                                    {/* STATUS BADGE */}
                                    <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase">
                                        {event.status}
                                    </div>

                                    <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-black text-indigo-600">
                                        {event.category}
                                    </div>
                                </div>

                                <div className="p-7">
                                    <h3 className="text-xl font-black mb-2">{event.title}</h3>
                                    <p className="text-slate-500 text-sm italic line-clamp-2">
                                        {event.description}
                                    </p>

                                    <div className="mt-4 text-sm text-slate-600">
                                        📍 {event.location}<br/>
                                        📅 {new Date(event.date).toDateString()}
                                    </div>

                                    {/* PROGRESS BAR */}
                                    <div className="w-full bg-slate-100 h-2 rounded-full mt-5 overflow-hidden">
                                        <div
                                            className={`h-full ${
                                                event.enrolledCount >= event.capacity
                                                ? 'bg-red-500'
                                                : 'bg-indigo-600'
                                            }`}
                                            style={{ width: `${(event.enrolledCount / event.capacity) * 100}%` }}
                                        />
                                    </div>

                                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">
                                        {event.capacity - event.enrolledCount} Seats Remaining
                                    </p>

                                    {/* ACTION BUTTON */}
                                    <button
                                        className={`w-full mt-4 py-3 rounded-xl font-bold text-white ${
                                            event.enrolledCount >= event.capacity
                                            ? 'bg-orange-500 hover:bg-orange-600'
                                            : 'bg-indigo-600 hover:bg-indigo-700'
                                        }`}>
                                        {event.enrolledCount >= event.capacity
                                            ? 'Join Waitlist'
                                            : 'Get Ticket'}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredEvents.length === 0 && (
                    <p className="text-center mt-20 text-slate-400 italic text-xl">
                        No events found
                    </p>
                )}
            </div>
        </div>
    );
};

export default Home;
