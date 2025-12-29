import React from 'react';
import api from '../services/api';
import { Trash2, Edit, Pin, Hash, Archive, RotateCcw, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const NoteCard = ({ note, onRefresh, onEdit }) => {

    if (!note) return null;

    const formattedDate = new Date(note.updated_at || note.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const togglePin = async (e) => {
        e.stopPropagation();
        try {
            await api.patch(`/notes/${note.id}`, { is_pinned: !note.is_pinned });
            toast.success(note.is_pinned ? 'Note unpinned' : 'Note pinned');
            onRefresh();
        } catch (err) {
            console.error('Error toggling pin status:', err);
            toast.error(err.response?.data?.message || 'Failed to update note');
        }
    };

    const handleToggleArchive = async (e) => {
        e.stopPropagation();
        try {
            await api.patch(`/notes/${note.id}`, { is_archived: !note.is_archived });
            toast.success(note.is_archived ? 'Note restored' : 'Note archived');
            onRefresh();
        } catch (err) {
            console.error('Error changing archive status:', err);
            toast.error(err.response?.data?.message || 'Failed to update note');
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        const confirmMsg = note.is_archived ? 'Permanently delete this archived note?' : 'Delete this note?';
        if (!window.confirm(confirmMsg)) return;
        try {
            await api.delete(`/notes/${note.id}`);
            toast.success('Note deleted successfully');
            onRefresh();
        } catch (err) {
            console.error('Error deleting note:', err);
            toast.error(err.response?.data?.message || 'Failed to delete note');
        }
    };

    return (
        <div
            onClick={() => onEdit(note)}
            style={{
                background: '#F4EEFF',
                padding: '20px',
                borderRadius: '12px',
                border: note.is_pinned ? '1.5px solid #DCD6F7' : '1px solid #DCD6F7',
                boxShadow: note.is_pinned ? '0 4px 12px rgba(220, 214, 247, 0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                position: 'relative',
                minHeight: '180px',
                opacity: note.is_archived ? 0.85 : 1
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(220, 214, 247, 0.3)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = note.is_pinned ? '0 4px 12px rgba(220, 214, 247, 0.3)' : '0 2px 8px rgba(0,0,0,0.05)';
            }}
        >
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#424874', maxWidth: '85%' }}>
                        {note.title || 'Untitled Note'}
                    </h3>
                    {!note.is_archived && (
                        <button onClick={togglePin} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                            <Pin size={16} fill={note.is_pinned ? "#DCD6F7" : "none"} color={note.is_pinned ? "#424874" : "#8B96C7"} />
                        </button>
                    )}
                </div>

                <p style={{
                    color: '#8B96C7',
                    fontSize: '0.875rem',
                    lineHeight: '1.6',
                    marginBottom: '16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {note.content}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {note.tags?.map(tag => (
                        <span key={tag.id} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            background: '#DCD6F7', color: '#424874', fontSize: '0.7rem',
                            fontWeight: '600', padding: '2px 8px', borderRadius: '8px'
                        }}>
                            <Hash size={10} style={{ opacity: 0.7 }} />
                            {tag.name}
                        </span>
                    ))}
                </div>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '20px',
                paddingTop: '12px',
                borderTop: '1px solid #DCD6F7'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8B96C7', fontSize: '0.75rem', fontWeight: '500' }}>
                    <Calendar size={12} />
                    {formattedDate}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handleToggleArchive} title={note.is_archived ? "Restore" : "Archive"} style={styles.actionBtn}>
                        {note.is_archived ? <RotateCcw size={16} color="#424874" /> : <Archive size={16} color="#424874" />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onEdit(note); }} title="Edit" style={styles.actionBtn}>
                        <Edit size={16} color="#424874" />
                    </button>
                    <button onClick={handleDelete} title="Delete" style={styles.actionBtn}>
                        <Trash2 size={16} color="#424874" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    actionBtn: {
        background: 'none',
        border: 'none',
        color: '#A6B1E1',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        padding: '4px',
        transition: 'color 0.2s',
    }
};

export default NoteCard;

