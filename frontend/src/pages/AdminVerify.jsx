import { useState } from 'react';
import axios from 'axios';

const AdminVerify = () => {
    const [ticketId, setTicketId] = useState('');
    const [result, setResult] = useState(null);

    const handleVerify = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`http://localhost:5001/api/events/verify`, { ticketId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResult({ success: true, message: res.data.message });
        } catch (err) {
            setResult({ success: false, message: err.response.data.message });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
            <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full">
                <h1 className="text-2xl font-black mb-6">Gate Check-in</h1>
                <input 
                    type="text" 
                    placeholder="Enter Ticket ID or Scan Result" 
                    className="w-full p-4 bg-slate-100 rounded-xl mb-4 outline-none border-2 focus:border-indigo-500"
                    onChange={(e) => setTicketId(e.target.value)}
                />
                <button onClick={handleVerify} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold">Verify Ticket</button>
                
                {result && (
                    <div className={`mt-6 p-4 rounded-xl font-bold text-center ${result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {result.success ? "✅ Valid: Entry Allowed" : `❌ Invalid: ${result.message}`}
                    </div>
                )}
            </div>
        </div>
    );
};
export default AdminVerify;