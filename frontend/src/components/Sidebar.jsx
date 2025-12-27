import { useEffect, useState } from 'react';
import api from '../services/api';
import { Folder, Plus, Trash2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const Sidebar = ({ onFolderSelect, selectedFolderId, refreshTrigger }) => {
    const [folders, setFolders] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');

    const fetchFolders = async () => {
        try {
            const res = await api.get('/folders');
            setFolders(res.data.data.folders || []);
        } catch (err) {
            console.error('Failed to fetch folders');
        }
    };

    useEffect(() => {
        fetchFolders();
    }, [refreshTrigger]);

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        if (!newFolderName.trim()) return;
        try {
            await api.post('/folders', { name: newFolderName, color: '#3498db' });
            setNewFolderName('');
            setIsAdding(false);
            fetchFolders();
            toast.success('Folder created');
        } catch (err) {
            toast.error('Failed to create folder');
        }
    };

    const handleDeleteFolder = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("Delete this folder? Notes inside won't be deleted, just moved to 'No Folder'.")) return;
        try {
            await api.delete(`/folders/${id}`);
            fetchFolders();
            if (selectedFolderId === id) onFolderSelect(null);
            toast.success('Folder removed');
        } catch (err) {
            toast.error('Failed to delete folder');
        }
    };

    return (
        <aside style={{ width: '260px', background: '#fff', borderRight: '1px solid #eee', padding: '20px', height: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ fontSize: '14px', color: '#888', textTransform: 'uppercase' }}>Folders</h3>
                <button onClick={() => setIsAdding(true)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#3498db' }}>
                    <Plus size={18} />
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleCreateFolder} style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                    <input
                        autoFocus
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="Folder name..."
                        style={{ flex: 1, padding: '5px', fontSize: '13px' }}
                    />
                    <button type="submit" style={{ border: 'none', background: 'none', color: 'green' }}><Check size={16}/></button>
                    <button type="button" onClick={() => setIsAdding(false)} style={{ border: 'none', background: 'none', color: 'red' }}><X size={16}/></button>
                </form>
            )}

            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li
                    onClick={() => onFolderSelect(null)}
                    style={{
                        padding: '10px', cursor: 'pointer', borderRadius: '6px',
                        background: selectedFolderId === null ? '#eaf2ff' : 'transparent',
                        color: selectedFolderId === null ? '#3498db' : '#444'
                    }}
                >
                    All Notes
                </li>
                {folders.map(folder => (
                    <li
                        key={folder.id}
                        onClick={() => onFolderSelect(folder.id)}
                        style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '10px', cursor: 'pointer', borderRadius: '6px',
                            background: selectedFolderId === folder.id ? '#eaf2ff' : 'transparent',
                            color: selectedFolderId === folder.id ? '#3498db' : '#444',
                            marginBottom: '2px'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Folder size={16} />
                            {folder.name}
                        </div>
                        <button
                            onClick={(e) => handleDeleteFolder(folder.id, e)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ccc' }}
                            className="hover-show"
                        >
                            <Trash2 size={14} />
                        </button>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default Sidebar;

