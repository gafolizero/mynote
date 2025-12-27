import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import NoteList from '../components/NoteList';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Search, LogOut } from 'lucide-react'; // Added icons

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState(''); // Hold search string

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <Sidebar />

            <main style={{ flex: 1, padding: '30px', background: '#fafafa' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>

                    <div style={{ position: 'relative', width: '350px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: '#888' }} />
                        <input
                            type="text"
                            placeholder="Search by title or content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 10px 10px 40px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '14px'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <span style={{ fontWeight: 'bold' }}>{user?.username}</span>
                        <button
                            onClick={logout}
                            style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#e74c3c', border: 'none', background: 'none', cursor: 'pointer' }} >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </header>

                <NoteList searchQuery={searchQuery} />
            </main>
        </div>
    );
};

export default Dashboard;

