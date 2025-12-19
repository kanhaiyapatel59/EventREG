import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';

const Profile = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Get user info for the PDF and UI
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            // If no token, we can't make the request
            if (!token) {
                setError("Please login to view your tickets.");
                setLoading(false);
                return;
            }

            const res = await axios.get('http://localhost:5001/api/enrollments/my-tickets', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Ensure data is an array before setting state
            setTickets(Array.isArray(res.data) ? res.data : []);
            setError(null);
        } catch (err) {
            console.error("Fetch Error:", err.response?.data || err.message);
            setError(err.response?.status === 401 ? "Session expired. Please login again." : "Failed to load tickets.");
            setTickets([]);
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => { 
        fetchTickets(); 
    }, []);

    const cancelTicket = async (id) => {
        if (!confirm("Are you sure you want to cancel this ticket? Your spot will be released.")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5001/api/enrollments/cancel/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Ticket Cancelled Successfully");
            fetchTickets(); // Refresh the list
        } catch (err) { 
            alert("Cancellation failed. Please try again."); 
        }
    };

    const downloadPDF = (t) => {
        const doc = new jsPDF();
        
        // Ticket Header
        doc.setFillColor(79, 70, 229); // Indigo color
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("OFFICIAL EVENT PASS", 20, 25);
        
        // Ticket Details
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.text(`${t.event?.title}`, 20, 60);
        
        doc.setFontSize(12);
        doc.text(`Attendee: ${user?.name}`, 20, 75);
        doc.text(`Location: ${t.event?.location}`, 20, 85);
        doc.text(`Date: ${new Date(t.event?.date).toDateString()}`, 20, 95);
        doc.text(`Ticket ID: ${t._id}`, 20, 105);
        
        doc.text("--------------------------------------------------", 20, 115);
        doc.text("Please present this PDF or QR code at the entrance.", 20, 125);

        doc.save(`${t.event?.title}-Ticket.pdf`);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header Section */}
            <div className="bg-indigo-600 py-20 text-center text-white shadow-lg">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-black uppercase tracking-tighter italic"
                >
                    My Passbook
                </motion.h1>
                <p className="mt-2 text-indigo-100 font-medium">Manage your digital entries and downloads</p>
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-10">
                {loading ? (
                    <div className="bg-white p-20 text-center rounded-3xl shadow-xl">
                        <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="font-bold text-slate-400 uppercase tracking-widest">Securing your passes...</p>
                    </div>
                ) : error ? (
                    <div className="bg-white p-12 text-center rounded-3xl shadow-xl border-2 border-red-50">
                        <p className="text-red-500 font-bold mb-4">{error}</p>
                        <button onClick={() => window.location.href='/login'} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold">Login Again</button>
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {tickets.length > 0 ? tickets.map(t => (
                            <motion.div 
                                key={t._id} 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-slate-100 group hover:border-indigo-200 transition-all"
                            >
                                {/* Left Side: Image */}
                                <div className="w-full md:w-64 h-64 relative overflow-hidden">
                                    <img 
                                        src={t.event?.image} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                        alt="event" 
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase text-indigo-600">
                                        Confirmed
                                    </div>
                                </div>

                                {/* Center: Details */}
                                <div className="p-8 flex-1 flex flex-col md:flex-row justify-between items-center gap-8">
                                    <div className="text-center md:text-left flex-1">
                                        <h2 className="text-3xl font-black text-slate-900 leading-tight">
                                            {t.event?.title}
                                        </h2>
                                        <div className="mt-3 space-y-1 text-slate-500 font-semibold text-sm">
                                            <p className="flex items-center justify-center md:justify-start gap-2">
                                                📅 {t.event ? new Date(t.event.date).toDateString() : 'TBD'}
                                            </p>
                                            <p className="flex items-center justify-center md:justify-start gap-2">
                                                📍 {t.event?.location}
                                            </p>
                                        </div>

                                        <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
                                            <button 
                                                onClick={() => downloadPDF(t)} 
                                                className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 active:scale-95"
                                            >
                                                PDF TICKET
                                            </button>
                                            <button 
                                                onClick={() => cancelTicket(t._id)} 
                                                className="text-red-500 border-2 border-red-50 px-8 py-3 rounded-2xl font-black hover:bg-red-50 transition active:scale-95"
                                            >
                                                CANCEL
                                            </button>
                                        </div>
                                    </div>

                                    {/* Right Side: QR Code */}
                                    <div className="flex flex-col items-center bg-slate-50 p-6 rounded-[2rem] border-2 border-dashed border-slate-200 shadow-inner">
                                        <QRCodeSVG 
                                            value={JSON.stringify({ ticketId: t._id, user: user?.name })} 
                                            size={100} 
                                            level="H" 
                                        />
                                        <p className="text-[10px] font-black mt-4 text-slate-400 uppercase tracking-widest text-center">
                                            Scan for Entry<br/>
                                            <span className="text-indigo-400">{t._id.slice(-8)}</span>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="bg-white p-24 text-center rounded-[3rem] border-4 border-dashed border-slate-100">
                                <p className="text-slate-300 font-black text-2xl uppercase italic tracking-tighter">Your passbook is empty</p>
                                <button 
                                    onClick={() => window.location.href='/'} 
                                    className="mt-6 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-indigo-600 transition"
                                >
                                    Browse Events
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;