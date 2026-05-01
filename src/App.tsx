import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import Trade from './pages/Trade';
import Portfolio from './pages/Portfolio';
import Assets from './pages/Assets';
import { useUserStore } from './stores/userStore';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = useUserStore((state) => state.token);
    return token ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/dashboard" element={
                    <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />

                <Route path="/market" element={
                    <ProtectedRoute><Market /></ProtectedRoute>
                } />

                <Route path="/trade" element={
                    <ProtectedRoute><Trade /></ProtectedRoute>
                } />

                <Route path="/portfolio" element={
                    <ProtectedRoute><Portfolio /></ProtectedRoute>
                } />

                <Route path="/assets" element={
                    <ProtectedRoute><Assets /></ProtectedRoute>
                } />

                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
