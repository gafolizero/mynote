import { useEffect, useState } from 'react';
import api from '../services/api';
import { Folder, Plus, X } from 'lucide-react';
import TagList from './TagList';

const Sidebar = ({ selectedFolderId, onFolderSelect, selectedTagId, onTagSelect, refreshTrigger }) => {
    const [folders, setFolders] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');

    useEffect(() => {
        fetchFolders();
    }, [refreshTrigger]);

    const fetchFolders = async () => {
        try {
            const response = await api.get('/folders');
            setFolders(response.data.data.folders);
        } catch (err) {
            console.error('Error fetching folders:', err);
        }
    };

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        if (!newFolderName.trim()) return;
        try {
            await api.post('/folders', { name: newFolderName });
            setNewFolderName('');
            setIsCreating(false);
            fetchFolders();
        } catch (err) {
            console.error('Error creating folder:', err);
        }
    };

    return (
        <aside style={{ width: '280px', background: '#fff', borderRight: '1px solid #eee', padding: '25px 15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 10px' }}>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Folders</h3>
                <button onClick={() => setIsCreating(!isCreating)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                    {isCreating ? <X size={16}/> : <Plus size={16}/>}
                </button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreateFolder} style={{ marginBottom: '15px', padding: '0 10px' }}>
                    <input
                        autoFocus
                        placeholder="Folder name..."
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' }}
                    />
                </form>
            )}

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {folders.map(folder => (
                    <button
                        key={folder.id}
                        onClick={() => onFolderSelect(folder.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 15px',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            background: selectedFolderId === folder.id ? '#3498db15' : 'transparent',
                            color: selectedFolderId === folder.id ? '#3498db' : '#555',
                            fontWeight: selectedFolderId === folder.id ? '600' : '400',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Folder size={18} style={{ opacity: 0.7 }} />
                        {folder.name}
                    </button>
                ))}
            </nav>

            <div style={{ marginTop: '30px' }}>
                <TagList activeTagId={selectedTagId} onTagSelect={onTagSelect} />
            </div>
        </aside>
    );
};

export default Sidebar;

