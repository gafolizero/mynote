import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Folder, Plus, X, Inbox, LayoutGrid, Archive, Trash2 } from 'lucide-react';
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
            toast.success('Folder created successfully');
        } catch (err) {
            console.error('Error creating folder:', err);
            toast.error(err.response?.data?.message || 'Failed to create folder');
        }
    };

    const handleDeleteFolder = async (folderId, folderName, e) => {
        e.stopPropagation();

        if (!window.confirm(`Are you sure you want to delete "${folderName}"? Notes in this folder will be moved to unorganized.`)) {
            return;
        }

        try {
            await api.delete(`/folders/${folderId}`);

            if (selectedFolderId === folderId) {
                onFolderSelect(null);
            }

            fetchFolders();
            toast.success('Folder deleted successfully');
        } catch (err) {
            console.error('Error deleting folder:', err);
            toast.error(err.response?.data?.message || 'Failed to delete folder');
        }
    };

    const btnStyle = (isActive) => ({
        display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 15px',
        border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
        background: isActive ? '#DCD6F7' : 'transparent',
        color: isActive ? '#424874' : '#8B96C7',
        fontWeight: isActive ? '600' : '400', transition: 'all 0.2s', marginBottom: '4px'
    });

    return (
        <aside style={{
            width: '280px',
            background: '#F4EEFF',
            borderRight: '1px solid #DCD6F7',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <div style={{
                padding: '20px 15px',
                borderBottom: '1px solid #DCD6F7',
                flexShrink: 0,
                background: '#F4EEFF'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: '#424874',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#F4EEFF',
                        fontWeight: '700',
                        fontSize: '18px',
                        boxShadow: '0 2px 8px rgba(66, 72, 116, 0.3)'
                    }}>
                        N
                    </div>
                    <span style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#424874',
                        letterSpacing: '-0.5px'
                    }}>
                        myNote
                    </span>
                </div>
            </div>

            <div
                className="custom-scrollbar"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    overflowY: 'auto',
                    padding: '25px 15px'
                }}
            >
                <div style={{ marginBottom: '25px', flexShrink: 0 }}>
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

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', padding: '0 10px', flexShrink: 0 }}>
                    <h3 style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#8B96C7', textTransform: 'uppercase', letterSpacing: '1px' }}>Folders</h3>
                    <button onClick={() => setIsCreating(!isCreating)} style={{ background: 'none', border: 'none', color: '#8B96C7', cursor: 'pointer' }}>
                        {isCreating ? <X size={14}/> : <Plus size={14}/>}
                    </button>
                </div>

                {isCreating && (
                    <form onSubmit={handleCreateFolder} style={{ marginBottom: '15px', padding: '0 10px', flexShrink: 0 }}>
                        <input autoFocus placeholder="Folder name..." value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #DCD6F7', borderRadius: '6px', fontSize: '0.9rem', background: '#F4EEFF', color: '#424874' }} />
                    </form>
                )}

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '30px', flexShrink: 0 }}>
                    {folders.map(folder => {
                        const isActive = !showArchived && selectedFolderId === folder.id;
                        return (
                            <div
                                key={folder.id}
                                style={{
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '4px'
                                }}
                                onMouseEnter={(e) => {
                                    const deleteBtn = e.currentTarget.querySelector('.delete-btn');
                                    if (deleteBtn) deleteBtn.style.opacity = '1';
                                }}
                                onMouseLeave={(e) => {
                                    const deleteBtn = e.currentTarget.querySelector('.delete-btn');
                                    if (deleteBtn) deleteBtn.style.opacity = '0';
                                }}
                            >
                                <button
                                    onClick={() => onFolderSelect(folder.id)}
                                    style={btnStyle(isActive)}
                                >
                                    <Folder size={18} style={{ opacity: 0.7 }} /> {folder.name}
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={(e) => handleDeleteFolder(folder.id, folder.name, e)}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        background: 'none',
                                        border: 'none',
                                        color: '#424874',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        opacity: '0',
                                        transition: 'opacity 0.2s',
                                        borderRadius: '4px'
                                    }}
                                    title="Delete folder"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        );
                    })}
                </nav>

                <div style={{ flex: 1, minHeight: 0 }}>
                    <TagList activeTagId={selectedTagId} onTagSelect={(id) => { onTagSelect(id); onToggleArchive(false); }} />
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

