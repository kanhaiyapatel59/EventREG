import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    // If no user or user is not admin, kick them back to home
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" />;
    }

    return children;
};

export default AdminRoute;