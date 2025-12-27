import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const { user } = useContext(AuthContext);

    return (
        <Router>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />

                <Route path="/" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> } />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;

