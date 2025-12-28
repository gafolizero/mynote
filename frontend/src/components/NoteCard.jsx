import React from 'react';
import api from '../services/api';
import { Trash2, Edit, Pin, Hash } from 'lucide-react';

const NoteCard = ({ note, onRefresh, onEdit }) => {

    const togglePin = async (e) => {
        e.stopPropagation();
        try {
            await api.patch(`/notes/${note.id}`, {
                is_pinned: !note.is_pinned
            });
            onRefresh();
        } catch (err) {
            console.error('Error toggling pin status:', err);
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (!window.confirm('Delete this note?')) return;
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
                border: note.is_pinned ? '1.5px solid #3498db' : '1px solid #eee',
                boxShadow: note.is_pinned
                    ? '0 4px 12px rgba(52, 152, 219, 0.1)'
                    : '0 2px 8px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                position: 'relative'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = note.is_pinned
                    ? '0 4px 12px rgba(52, 152, 219, 0.1)'
                    : '0 2px 8px rgba(0,0,0,0.02)';
            }}
        >
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h3 style={{
                        margin: 0,
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: '#333',
                        maxWidth: '85%'
                    }}>
                        {note.title}
                    </h3>

                    <button
                        onClick={togglePin}
                        title={note.is_pinned ? "Unpin note" : "Pin note"}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f0f7ff'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                        <Pin
                            size={18}
                            fill={note.is_pinned ? "#3498db" : "none"}
                            color={note.is_pinned ? "#3498db" : "#ccc"}
                            style={{ transition: 'all 0.2s' }}
                        />
                    </button>
                </div>

                <p style={{
                    color: '#666',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    marginBottom: '15px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {note.content}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                    {note.tags && note.tags.length > 0 && note.tags.map(tag => (
                        <span
                            key={tag.id}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: '#f0f7ff',
                                color: '#3498db',
                                fontSize: '0.7rem',
                                fontWeight: '600',
                                padding: '3px 10px',
                                borderRadius: '12px',
                                border: '1px solid #e1effe'
                            }}
                        >
                            <Hash size={10} style={{ opacity: 0.7 }} />
                            {tag.name}
                        </span>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(note); }}
                    style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '5px' }}
                >
                    <Edit size={16} />
                </button>
                <button
                    onClick={handleDelete}
                    style={{ background: 'none', border: 'none', color: '#ff7675', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '5px' }}
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default NoteCard;

