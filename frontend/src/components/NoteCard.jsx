import React from 'react';
import api from '../services/api';
import { Trash2, Edit, Pin, Hash } from 'lucide-react';

const NoteCard = ({ note, onRefresh, onEdit }) => {

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
                border: '1px solid #eee',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s',
                cursor: 'pointer',
                position: 'relative'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
            }}
        >
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>
                        {note.title}
                    </h3>
                    {note.is_pinned && <Pin size={16} fill="#3498db" color="#3498db" />}
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

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginTop: '10px'
                }}>
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
                                border: '1px solid #e1effe',
                                textTransform: 'lowercase'
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
                    style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                    <Edit size={16} />
                </button>
                <button
                    onClick={handleDelete}
                    style={{ background: 'none', border: 'none', color: '#ff7675', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default NoteCard;

