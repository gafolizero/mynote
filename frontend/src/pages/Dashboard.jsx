import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import NoteList from '../components/NoteList';
import CreateNote from '../components/CreateNote';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Search, LogOut, Plus } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNoteCreated = () => {
    setIsCreating(false);
    setRefreshKey(oldKey => oldKey + 1);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Sidebar key={refreshKey} />

      <main style={{ flex: 1, padding: '30px', background: '#fafafa' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div style={{ position: 'relative', width: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: '#888' }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button
              onClick={() => setIsCreating(true)}
              style={{ background: '#3498db', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }} >

              <Plus size={18}/> New Note
            </button>
            <span style={{ fontWeight: 'bold' }}>{user?.username}</span>
            <button onClick={logout} style={{ color: '#e74c3c', border: 'none', background: 'none', cursor: 'pointer' }}><LogOut size={18}/></button>
          </div>
        </header>

        {isCreating && (
          <CreateNote
            onNoteCreated={handleNoteCreated}
            onCancel={() => setIsCreating(false)}
          />
        )}

        <NoteList searchQuery={searchQuery} key={refreshKey} />
      </main>
    </div>
  );
};

export default Dashboard;

