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

    const handleFolderSelect = (id) => {
        setSelectedFolderId(id);
        setSelectedTagId(null);
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
                <header style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px',
                    gap: '20px'
                }}>

                    <div style={{
                        position: 'relative',
                        flex: '1',
                        minWidth: '200px',
                        maxWidth: '450px'
                    }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#888' }} />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '90%',
                                padding: '12px 12px 12px 40px',
                                borderRadius: '10px',
                                border: '1px solid #eee',
                                outline: 'none',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                fontSize: '0.95rem'
                            }}
                        />
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        flexShrink: 0
                    }}>
                        <button
                            onClick={() => { setIsCreating(true); setNoteToEdit(null); }}
                            style={{
                                background: '#3498db', color: 'white', border: 'none',
                                padding: '10px 18px', borderRadius: '8px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600',
                                fontSize: '0.9rem',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            <Plus size={18}/>
                            <span className="hide-mobile">New Note</span>
                        </button>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            borderLeft: '1px solid #eee',
                            paddingLeft: '15px'
                        }}>
                            <span style={{ fontWeight: '600', color: '#333', fontSize: '0.9rem' }}>
                                {user?.username}
                            </span>
                            <button
                                onClick={logout}
                                style={{
                                    color: '#e74c3c', border: 'none', background: 'none',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                                    fontSize: '0.9rem', padding: '5px'
                                }}
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
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
                    key={refreshKey}
                    onEditNote={(note) => { setNoteToEdit(note); setIsCreating(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                />
            </main>
        </div>
    );
};

export default Dashboard;

