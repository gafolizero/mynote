import React from 'react';
import api from '../services/api';
import { Trash2, Edit, Pin, Hash, Archive, RotateCcw, Calendar } from 'lucide-react';

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
            onRefresh();
        } catch (err) {
            console.error('Error toggling pin status:', err);
        }
    };

    const handleToggleArchive = async (e) => {
        e.stopPropagation();
        try {
            await api.patch(`/notes/${note.id}`, { is_archived: !note.is_archived });
            onRefresh();
        } catch (err) {
            console.error('Error changing archive status:', err);
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        const confirmMsg = note.is_archived ? 'Permanently delete this archived note?' : 'Move this note to trash?';
        if (!window.confirm(confirmMsg)) return;
        try {
            await api.delete(`/notes/${note.id}`);
            onRefresh();
        } catch (err) {
            console.error('Error deleting note:', err);
        }
    };

    return (
        <div
            onClick={() => onEdit(note)}
            style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                border: note.is_pinned ? '1.5px solid #6366f1' : '1px solid #e2e8f0',
                boxShadow: note.is_pinned ? '0 4px 12px rgba(99, 102, 241, 0.1)' : '0 2px 8px rgba(0,0,0,0.02)',
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
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = note.is_pinned ? '0 4px 12px rgba(99, 102, 241, 0.1)' : '0 2px 8px rgba(0,0,0,0.02)';
            }}
        >
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#1e293b', maxWidth: '85%' }}>
                        {note.title || 'Untitled Note'}
                    </h3>
                    {!note.is_archived && (
                        <button onClick={togglePin} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                            <Pin size={16} fill={note.is_pinned ? "#6366f1" : "none"} color={note.is_pinned ? "#6366f1" : "#cbd5e1"} />
                        </button>
                    )}
                </div>

                <p style={{
                    color: '#64748b',
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
                            background: '#f1f5f9', color: '#475569', fontSize: '0.7rem',
                            fontWeight: '600', padding: '2px 8px', borderRadius: '8px'
                        }}>
                            <Hash size={10} style={{ opacity: 0.6 }} />
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
                borderTop: '1px solid #f1f5f9'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '500' }}>
                    <Calendar size={12} />
                    {formattedDate}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handleToggleArchive} title={note.is_archived ? "Restore" : "Archive"} style={styles.actionBtn}>
                        {note.is_archived ? <RotateCcw size={16} color="#10b981" /> : <Archive size={16} />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onEdit(note); }} title="Edit" style={styles.actionBtn}>
                        <Edit size={16} />
                    </button>
                    <button onClick={handleDelete} title="Delete" style={styles.actionBtn}>
                        <Trash2 size={16} color="#ef4444" />
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
        color: '#94a3b8',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        padding: '4px',
        transition: 'color 0.2s',
    }
};

export default NoteCard;

