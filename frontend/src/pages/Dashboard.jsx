import { useState, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import NoteList from '../components/NoteList';
import CreateNote from '../components/CreateNote';
import { AuthContext } from '../context/AuthContext';
import { Search, LogOut, Plus } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [selectedTagId, setSelectedTagId] = useState(null);

    const [isCreating, setIsCreating] = useState(false);
    const [noteToEdit, setNoteToEdit] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => {
        setIsCreating(false);
        setNoteToEdit(null);
        setRefreshKey(prev => prev + 1);
    };

    const handleEditInitiated = (note) => {
        setNoteToEdit(note);
        setIsCreating(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFolderSelect = (id) => {
        const nextFolderId = id === selectedFolderId ? null : id;
        setSelectedFolderId(nextFolderId);
        if (nextFolderId) setSelectedTagId(null);
    };

    const handleTagSelect = (id) => {
        const nextTagId = id === selectedTagId ? null : id;
        setSelectedTagId(nextTagId);
        if (nextTagId) setSelectedFolderId(null);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif', background: '#fafafa' }}>

            <Sidebar
                selectedFolderId={selectedFolderId}
                onFolderSelect={handleFolderSelect}
                selectedTagId={selectedTagId}
                onTagSelect={handleTagSelect}
                refreshTrigger={refreshKey}
            />

            <main style={{ flex: 1, padding: '30px' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div style={{ position: 'relative', width: '350px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: '#888' }} />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 10px 10px 40px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                outline: 'none',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button
                            onClick={() => { setIsCreating(true); setNoteToEdit(null); }}
                            style={{
                                background: '#3498db', color: 'white', border: 'none',
                                padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500'
                            }}
                        >
                            <Plus size={18}/> New Note
                        </button>
                        <span style={{ fontWeight: '600', color: '#333' }}>{user?.username}</span>
                        <button
                            onClick={logout}
                            style={{ color: '#e74c3c', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </header>

                {(isCreating || noteToEdit) && (
                    <CreateNote
                        noteToEdit={noteToEdit}
                        onNoteCreated={handleRefresh}
                        onCancel={() => { setIsCreating(false); setNoteToEdit(null); }}
                    />
                )}

                <NoteList
                    searchQuery={searchQuery}
                    folderId={selectedFolderId}
                    tagId={selectedTagId}
                    key={`list-${refreshKey}-${selectedFolderId}-${selectedTagId}`}
                    onEditNote={handleEditInitiated}
                />
            </main>
        </div>
    );
};

export default Dashboard;

