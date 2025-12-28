import { useEffect, useState } from 'react';
import api from '../services/api';
import { Folder, Plus, X, Inbox, LayoutGrid, Archive } from 'lucide-react';
import TagList from './TagList';

const Sidebar = ({
    selectedFolderId,
    onFolderSelect,
    selectedTagId,
    onTagSelect,
    showArchived,
    onToggleArchive,
    refreshTrigger
}) => {
    const [folders, setFolders] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');

    useEffect(() => { fetchFolders(); }, [refreshTrigger]);

    const fetchFolders = async () => {
        try {
            const response = await api.get('/folders');
            setFolders(response.data.data.folders);
        } catch (err) { console.error('Error fetching folders:', err); }
    };

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        if (!newFolderName.trim()) return;
        try {
            await api.post('/folders', { name: newFolderName });
            setNewFolderName('');
            setIsCreating(false);
            fetchFolders();
        } catch (err) { console.error('Error creating folder:', err); }
    };

    const btnStyle = (isActive) => ({
        display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 15px',
        border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
        background: isActive ? '#3498db15' : 'transparent',
        color: isActive ? '#3498db' : '#555',
        fontWeight: isActive ? '600' : '400', transition: 'all 0.2s', marginBottom: '4px'
    });

    return (
        <aside style={{ width: '280px', background: '#fff', borderRight: '1px solid #eee', padding: '25px 15px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '25px' }}>
                <button
                    onClick={() => { onFolderSelect(null); onToggleArchive(false); }}
                    style={btnStyle(!showArchived && selectedFolderId === null)}
                >
                    <LayoutGrid size={18} /> All Notes
                </button>

                <button
                    onClick={() => { onFolderSelect('unorganized'); onToggleArchive(false); }}
                    style={btnStyle(!showArchived && selectedFolderId === 'unorganized')}
                >
                    <Inbox size={18} /> Unorganized
                </button>

                <button
                    onClick={() => onToggleArchive(true)}
                    style={btnStyle(showArchived)}
                >
                    <Archive size={18} /> Archive
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', padding: '0 10px' }}>
                <h3 style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#bbb', textTransform: 'uppercase', letterSpacing: '1px' }}>Folders</h3>
                <button onClick={() => setIsCreating(!isCreating)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                    {isCreating ? <X size={14}/> : <Plus size={14}/>}
                </button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreateFolder} style={{ marginBottom: '15px', padding: '0 10px' }}>
                    <input autoFocus placeholder="Folder name..." value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)}
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem' }} />
                </form>
            )}

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '30px' }}>
                {folders.map(folder => (
                    <button key={folder.id} onClick={() => onFolderSelect(folder.id)} style={btnStyle(!showArchived && selectedFolderId === folder.id)}>
                        <Folder size={18} style={{ opacity: 0.7 }} /> {folder.name}
                    </button>
                ))}
            </nav>

            <TagList activeTagId={selectedTagId} onTagSelect={(id) => { onTagSelect(id); onToggleArchive(false); }} />
        </aside>
    );
};

export default Sidebar;
