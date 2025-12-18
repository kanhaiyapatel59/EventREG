import { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [myEvents, setMyEvents] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchMyEvents = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get('http://localhost:5001/api/enrollments/my-enrollments', config);
                setMyEvents(res.data);
            } catch (err) {
                console.error("Error fetching dashboard data", err);
            }
        };
        fetchMyEvents();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
                <p className="text-gray-600 mb-8">Here are the events you are currently enrolled in.</p>

                <div className="space-y-4">
                    {myEvents.length === 0 ? (
                        <p className="text-gray-500 italic">You haven't enrolled in any events yet.</p>
                    ) : (
                        myEvents.map((item) => (
                            <div key={item._id} className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg">{item.event?.title}</h3>
                                    <p className="text-sm text-gray-500">📍 {item.event?.location} | 📅 {new Date(item.event?.date).toLocaleDateString()}</p>
                                </div>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                    Enrolled
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;