import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [events, setEvents] = useState([]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            // Fetch both enrollments and events
            const enrollRes = await axios.get('http://localhost:5001/api/enrollments/admin/all', config);
            const eventRes = await axios.get('http://localhost:5001/api/events');
            
            setEnrollments(enrollRes.data);
            setEvents(eventRes.data);
        } catch (err) {
            alert("Error fetching admin data");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm("Are you sure? This will also remove all enrollments for this event.")) return;

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`http://localhost:5001/api/events/${eventId}`, config);
            alert("Event deleted");
            fetchData(); // Refresh the lists
        } catch (err) {
            alert("Delete failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 space-y-10">
            {/* Section 1: Event Management */}
            <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Manage Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {events.map(event => (
                        <div key={event._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                            <div>
                                <p className="font-bold">{event.title}</p>
                                <p className="text-sm text-gray-500">{event.enrolledCount} Participants</p>
                            </div>
                            <button 
                                onClick={() => handleDeleteEvent(event._id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section 2: Master Enrollment Table (Keep your existing table code here) */}
            <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Enrollment Details</h2>
                {/* ... Paste the <table> code from Step 12 here ... */}
            </section>
        </div>
    );
};

export default AdminDashboard;