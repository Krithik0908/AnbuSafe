import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useUser();

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
