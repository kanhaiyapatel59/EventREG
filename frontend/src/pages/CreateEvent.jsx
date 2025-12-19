import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: '', 
        description: '', 
        date: '', 
        location: '', 
        capacity: '', 
        category: 'Tech',
        image: '' // This now stores the URL string
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            // We send the formData directly since 'image' is just a string link now
            await axios.post('http://localhost:5001/api/events', formData, config);

            alert("Event Launched Successfully! 🚀");
            navigate('/');
        } catch (err) {
            console.error("SUBMISSION ERROR:", err);
            alert(err.response?.data?.message || "Failed to create event.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-2xl max-w-xl w-full space-y-6 border border-slate-100">
                <div className="text-center">
                    <h2 className="text-4xl font-black text-slate-900 leading-tight">Create Experience</h2>
                    <p className="text-slate-500 mt-2">Use an online image link for your event poster.</p>
                </div>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Event Title</label>
                            <input type="text" placeholder="Digital Art Expo" required className="w-full mt-1 p-3 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                onChange={(e) => setFormData({...formData, title: e.target.value})} />
                        </div>

                        <div>
                            <label className="text-sm font-bold text-slate-700 ml-1">Category</label>
                            <select className="w-full mt-1 p-3 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                onChange={(e) => setFormData({...formData, category: e.target.value})}>
                                <option value="Tech">Tech</option>
                                <option value="Music">Music</option>
                                <option value="Business">Business</option>
                                <option value="Sports">Sports</option>
                                <option value="Art">Art</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-slate-700 ml-1">Max Capacity</label>
                            <input type="number" placeholder="100" required className="w-full mt-1 p-3 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                onChange={(e) => setFormData({...formData, capacity: e.target.value})} />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
                        <textarea placeholder="Describe the event details..." required className="w-full mt-1 p-3 bg-slate-100 rounded-xl h-24 outline-none focus:ring-2 focus:ring-indigo-500"
                            onChange={(e) => setFormData({...formData, description: e.target.value})} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-bold text-slate-700 ml-1">Date</label>
                            <input type="date" required className="w-full mt-1 p-3 bg-slate-100 rounded-xl" onChange={(e) => setFormData({...formData, date: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-700 ml-1">Location</label>
                            <input type="text" placeholder="London, UK or Zoom" required className="w-full mt-1 p-3 bg-slate-100 rounded-xl"
                                onChange={(e) => setFormData({...formData, location: e.target.value})} />
                        </div>
                    </div>

                    {/* IMAGE URL INPUT */}
                    <div>
                        <label className="text-sm font-bold text-slate-700 ml-1">Image URL</label>
                        <input 
                            type="text" 
                            placeholder="https://images.unsplash.com/your-image-link" 
                            required 
                            className="w-full mt-1 p-3 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                            onChange={(e) => setFormData({...formData, image: e.target.value})} 
                        />
                        
                        {/* LIVE PREVIEW BOX */}
                        {formData.image && (
                            <div className="mt-4">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Preview:</p>
                                <img 
                                    src={formData.image} 
                                    alt="Preview" 
                                    className="w-full h-32 object-cover rounded-xl border border-slate-200"
                                    onError={(e) => {e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL'}}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <button type="submit" disabled={loading} className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all ${loading ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'}`}>
                    {loading ? "Launching..." : "🚀 Launch Event"}
                </button>
            </form>
        </div>
    );
};

export default CreateEvent;