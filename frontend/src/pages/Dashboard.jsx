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

                    <div style={styles.headerActions}>
                        <div style={styles.sortContainer}>
                            <div style={styles.iconWrapper}>
                                <ArrowUpDown size={14} color="#424874" strokeWidth={2.5} />
                            </div>
                            <div style={styles.selectWrapper}>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    style={styles.select}
                                    onFocus={(e) => e.currentTarget.parentElement.parentElement.style.boxShadow = '0 2px 8px rgba(220, 214, 247, 0.4)'}
                                    onBlur={(e) => e.currentTarget.parentElement.parentElement.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)'}
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
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#DCD6F7'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                {sortOrder === 'ASC' ? <SortAsc size={18} /> : <SortDesc size={18} />}
                            </button>
                        </div>

                        <button
                            onClick={() => { setIsCreating(true); setNoteToEdit(null); }}
                            style={styles.newNoteBtn}
                        >
                            <Plus size={18}/> <span style={{ whiteSpace: 'nowrap' }}>New Note</span>
                        </button>

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

const styles = {
    dashboardLayout: {
        display: 'flex',
        height: '100vh',
        fontFamily: "'Inter', sans-serif",
        background: '#F4EEFF',
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
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        gap: '16px'
    },
    searchWrapper: {
        position: 'relative',
        flex: '1',
        minWidth: '200px',
        maxWidth: '400px'
    },
    searchIcon: {
        position: 'absolute',
        left: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#8B96C7'
    },
    searchInput: {
        width: '100%',
        padding: '12px 16px 12px 44px',
        borderRadius: '12px',
        border: '1px solid #DCD6F7',
        background: '#F4EEFF',
        fontSize: '14px',
        outline: 'none',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        transition: 'border-color 0.2s',
        color: '#424874'
    },
    headerActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap'
    },
    sortContainer: {
        display: 'flex',
        alignItems: 'center',
        background: '#F4EEFF',
        borderRadius: '10px',
        border: '1px solid #DCD6F7',
        padding: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        minWidth: 'fit-content',
        transition: 'all 0.2s ease'
    },
    iconWrapper: {
        padding: '6px 8px 6px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        minWidth: '100px'
    },
    select: {
        appearance: 'none',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        padding: '6px 28px 6px 8px',
        border: 'none',
        outline: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '600',
        color: '#424874',
        minWidth: '100px',
        width: '100%'
    },
    chevron: {
        position: 'absolute',
        right: '8px',
        pointerEvents: 'none',
        color: '#8B96C7',
        top: '50%',
        transform: 'translateY(-50%)'
    },
    separator: {
        width: '1px',
        height: '20px',
        background: '#DCD6F7',
        margin: '0 4px',
        flexShrink: 0
    },
    toggleButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px 8px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        color: '#424874',
        borderRadius: '6px',
        transition: 'background-color 0.2s ease',
        minWidth: '32px',
        height: '32px'
    },
    newNoteBtn: {
        background: '#DCD6F7',
        color: '#424874',
        border: 'none',
        padding: '10px 16px',
        borderRadius: '10px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: '600',
        boxShadow: '0 4px 6px -1px rgba(220, 214, 247, 0.4)',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
        flexShrink: 0
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        paddingLeft: '8px',
        borderLeft: '1px solid #DCD6F7',
        flexShrink: 0
    },
    avatar: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: '#424874',
        color: '#F4EEFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: '700'
    },
    logoutBtn: {
        color: '#8B96C7',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        padding: '4px',
        display: 'flex'
    }
};

export default Dashboard;

