import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [enrollments, setEnrollments] = useState([]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get('http://localhost:5001/api/enrollments/admin/all', config);
                setEnrollments(res.data);
            } catch (err) {
                alert("Failed to fetch data. Are you an Admin?");
            }
        };
        fetchAllData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Management: All Enrollments</h1>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-indigo-600 text-white">
                            <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">User</th>
                            <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                            <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">Event Name</th>
                            <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider">Enrolled Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrollments.map((enroll) => (
                            <tr key={enroll._id} className="hover:bg-gray-50">
                                <td className="px-5 py-5 border-b border-gray-200 text-sm">{enroll.user?.name}</td>
                                <td className="px-5 py-5 border-b border-gray-200 text-sm">{enroll.user?.email}</td>
                                <td className="px-5 py-5 border-b border-gray-200 text-sm font-medium">{enroll.event?.title}</td>
                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    {new Date(enroll.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {enrollments.length === 0 && <p className="p-10 text-center text-gray-500">No enrollments found yet.</p>}
            </div>
        </div>
    );
};

export default AdminDashboard;