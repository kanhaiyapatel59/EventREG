import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm p-4 flex justify-between items-center px-10">
            <Link to="/" className="text-xl font-bold text-indigo-600 italic">
                EventFlow
            </Link>

            <div className="space-x-6 flex items-center">
                <Link to="/" className="text-gray-600 hover:text-indigo-600">
                    Home
                </Link>

                {user ? (
                    <>
                        <Link
                            to="/dashboard"
                            className="text-gray-600 hover:text-indigo-600"
                        >
                            My Events
                        </Link>

                        {/* ✅ UPDATED ADMIN LINKS */}
                        {user.role === 'admin' && (
                            <>
                                <Link
                                    to="/create-event"
                                    className="text-red-500 font-medium italic"
                                >
                                    Create Event
                                </Link>

                                <Link
                                    to="/admin-stats"
                                    className="text-gray-600 hover:text-indigo-600"
                                >
                                    All Enrollments
                                </Link>
                            </>
                        )}

                        <button
                            onClick={logout}
                            className="bg-gray-200 px-3 py-1 rounded text-sm"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-600">
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="bg-indigo-600 text-white px-4 py-2 rounded"
                        >
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
