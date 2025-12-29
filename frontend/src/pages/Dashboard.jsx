import { useState, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import NoteList from '../components/NoteList';
import CreateNote from '../components/CreateNote';
import { AuthContext } from '../context/AuthContext';
import {
    Search, LogOut, Plus, ArrowUpDown,
    ChevronDown, SortAsc, SortDesc
} from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [selectedTagId, setSelectedTagId] = useState(null);
    const [showArchived, setShowArchived] = useState(false);
    const [sortBy, setSortBy] = useState('updated_at');
    const [sortOrder, setSortOrder] = useState('DESC');

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
        setShowArchived(false);
    };

    return (
        <div style={styles.dashboardLayout}>
            <Sidebar
                selectedFolderId={selectedFolderId}
                onFolderSelect={handleFolderSelect}
                selectedTagId={selectedTagId}
                onTagSelect={(id) => { setSelectedTagId(id); setShowArchived(false); }}
                showArchived={showArchived}
                onToggleArchive={(val) => { setShowArchived(val); if(val) { setSelectedFolderId(null); setSelectedTagId(null); }}}
                refreshTrigger={refreshKey}
            />

            <main className="custom-scrollbar" style={styles.mainContent}>
                <header style={styles.header}>
                    {/* Search Section */}
                    <div style={styles.searchWrapper}>
                        <Search size={18} style={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search your notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={styles.searchInput}
                        />
                    </div>

                    {/* Actions Section */}
                    <div style={styles.headerActions}>
                        {/* Sort Widget */}
                        <div style={styles.sortContainer}>
                            <div style={styles.iconWrapper}>
                                <ArrowUpDown size={14} color="#6366f1" strokeWidth={2.5} />
                            </div>
                            <div style={styles.selectWrapper}>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    style={styles.select}
                                >
                                    <option value="updated_at">Modified</option>
                                    <option value="created_at">Created</option>
                                    <option value="title">A-Z</option>
                                </select>
                                <ChevronDown size={14} style={styles.chevron} />
                            </div>
                            <div style={styles.separator} />
                            <button
                                onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
                                style={styles.toggleButton}
                                title="Toggle Sort Order"
                            >
                                {sortOrder === 'ASC' ? <SortAsc size={18} /> : <SortDesc size={18} />}
                            </button>
                        </div>

                        {/* New Note Button */}
                        <button
                            onClick={() => { setIsCreating(true); setNoteToEdit(null); }}
                            style={styles.newNoteBtn}
                        >
                            <Plus size={18}/> <span>New Note</span>
                        </button>

                        {/* User Profile & Logout */}
                        <div style={styles.userSection}>
                            <div style={styles.avatar}>
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                            <button onClick={logout} style={styles.logoutBtn} title="Logout">
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
                    isArchived={showArchived}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    key={refreshKey}
                    onEditNote={(note) => { setNoteToEdit(note); setIsCreating(false); }}
                />
            </main>
        </div>
    );
};

// Modern Style Object
const styles = {
    dashboardLayout: {
        display: 'flex',
        height: '100vh',
        fontFamily: "'Inter', sans-serif",
        background: '#f8fafc',
        overflow: 'hidden'
    },
    mainContent: {
        flex: 1,
        padding: '32px 32px 100px 32px',
        overflowY: 'auto',
        height: '100vh'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        gap: '24px'
    },
    searchWrapper: {
        position: 'relative',
        flex: '1',
        maxWidth: '400px'
    },
    searchIcon: {
        position: 'absolute',
        left: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#94a3b8'
    },
    searchInput: {
        width: '100%',
        padding: '12px 16px 12px 44px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        background: '#fff',
        fontSize: '14px',
        outline: 'none',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        transition: 'border-color 0.2s'
    },
    headerActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    sortContainer: {
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        padding: '2px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    },
    iconWrapper: { padding: '0 8px 0 10px' },
    selectWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    select: {
        appearance: 'none',
        padding: '8px 24px 8px 4px',
        border: 'none',
        outline: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '600',
        color: '#475569'
    },
    chevron: { position: 'absolute', right: '4px', pointerEvents: 'none', color: '#94a3b8' },
    separator: { width: '1px', height: '18px', background: '#e2e8f0', margin: '0 4px' },
    toggleButton: {
        display: 'flex',
        padding: '8px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        color: '#6366f1'
    },
    newNoteBtn: {
        background: '#6366f1',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '10px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: '600',
        boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.2)'
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        paddingLeft: '8px',
        borderLeft: '1px solid #e2e8f0'
    },
    avatar: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: '#6366f1',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: '700'
    },
    logoutBtn: {
        color: '#94a3b8',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        padding: '4px',
        display: 'flex'
    }
};

export default Dashboard;

