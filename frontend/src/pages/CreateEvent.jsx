import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        capacity: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Retrieve the token we saved during login
            const token = localStorage.getItem('token');
            
            // We send the token in the "Authorization" header
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.post('http://localhost:5001/api/events', formData, config);
            alert("Event Created Successfully!");
            navigate('/'); // Go back to home to see the list
        } catch (err) {
            alert(err.response?.data?.message || "Failed to create event. Are you an admin?");
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Event</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Event Title" required className="w-full p-2 border rounded"
                        onChange={(e) => setFormData({...formData, title: e.target.value})} />
                    
                    <textarea placeholder="Description" required className="w-full p-2 border rounded"
                        onChange={(e) => setFormData({...formData, description: e.target.value})} />
                    
                    <input type="date" required className="w-full p-2 border rounded"
                        onChange={(e) => setFormData({...formData, date: e.target.value})} />
                    
                    <input type="text" placeholder="Location" required className="w-full p-2 border rounded"
                        onChange={(e) => setFormData({...formData, location: e.target.value})} />
                    
                    <input type="number" placeholder="Capacity" required className="w-full p-2 border rounded"
                        onChange={(e) => setFormData({...formData, capacity: e.target.value})} />
                    
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition">
                        Create Event
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;