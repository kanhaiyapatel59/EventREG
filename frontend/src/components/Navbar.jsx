import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const NavLinks = () => (
        <>
            <Link to="/" className="hover:text-indigo-600 font-bold transition">Home</Link>
            {user ? (
                <>
                    <Link to="/profile" className="hover:text-indigo-600 font-bold transition">My Tickets</Link>
                    {user.role === 'admin' && (
                        <>
                            <Link to="/create-event" className="hover:text-indigo-600 font-bold transition text-orange-600">Create Event</Link>
                            <Link to="/admin-stats" className="hover:text-indigo-600 font-bold transition text-orange-600">Admin Panel</Link>
                        </>
                    )}
                    <button onClick={handleLogout} className="bg-slate-900 text-white px-5 py-2 rounded-xl font-bold hover:bg-red-600 transition">Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login" className="hover:text-indigo-600 font-bold transition">Login</Link>
                    <Link to="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold">Sign Up</Link>
                </>
            )}
        </>
    );

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                <Link to="/" className="text-2xl font-black tracking-tighter text-slate-900">
                    EVENT<span className="text-indigo-600">FLOW</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 text-slate-600 text-sm">
                    <NavLinks />
                </div>

                {/* Mobile Hamburger Button */}
                <button className="md:hidden text-2xl" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-8 text-2xl font-black"
                    >
                        <button className="absolute top-6 right-6" onClick={() => setIsOpen(false)}>✕</button>
                        <div className="flex flex-col gap-8 text-center" onClick={() => setIsOpen(false)}>
                            <NavLinks />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;