import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null); 

    const handleEnroll = async (eventId) => {
        setProcessingId(eventId); 

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Please login to enroll!");
                setProcessingId(null);
                return;
            }

            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const res = await axios.post(
                `http://localhost:5001/api/enrollments/${eventId}`,
                {},
                config
            );

            alert(res.data.message);
            window.location.reload();
        } catch (err) {
            alert(err.response?.data?.message || "Enrollment failed");
            setProcessingId(null);
        }
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/events');
                setEvents(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching events", err);
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading events...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Upcoming Events
                    </h1>

                    <Link
                        to="/create-event"
                        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                    >
                        + Create Event (Admin)
                    </Link>
                </div>

                {events.length === 0 ? (
                    <p className="text-center text-gray-600">
                        No events found. Be the first to create one!
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <div
                                key={event._id}
                                className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
                            >
                                <h2 className="text-xl font-semibold mb-2 text-indigo-700">
                                    {event.title}
                                </h2>

                                <p className="text-gray-600 mb-4 line-clamp-3">
                                    {event.description}
                                </p>

                                <div className="text-sm text-gray-500 space-y-1">
                                    <p>📍 {event.location}</p>
                                    <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                                    <p>👥 Capacity: {event.enrolledCount} / {event.capacity}</p>
                                </div>

                                {/* ✅ UPDATED BUTTON */}
                                <button
                                    disabled={processingId === event._id}
                                    onClick={() => handleEnroll(event._id)}
                                    className={`mt-4 w-full py-2 rounded font-medium transition ${
                                        processingId === event._id
                                            ? 'bg-gray-400'
                                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                    }`}
                                >
                                    {processingId === event._id
                                        ? 'Processing...'
                                        : 'Enroll Now'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
