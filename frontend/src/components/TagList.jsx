import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Hash, X } from 'lucide-react';

const TagList = ({ activeTagId, onTagSelect }) => {
    const [tags, setTags] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newTagName, setNewTagName] = useState('');

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const res = await api.get('/tags');
            if (res.data?.data?.tags) setTags(res.data.data.tags);
        } catch (err) {
            console.error("Error loading tags", err);
        }
    };

    const handleCreateTag = async (e) => {
        e.preventDefault();
        if (!newTagName.trim()) return;
        try {
            await api.post('/tags', { name: newTagName });
            setNewTagName('');
            setIsCreating(false);
            fetchTags();
        } catch (err) {
            console.error("Error creating tag", err);
        }
    };

    return (
        <div style={{ marginTop: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Tags
                </h3>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
                >
                    {isCreating ? <X size={14} /> : <Plus size={14} />}
                </button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreateTag} style={{ padding: '0 10px 15px 10px' }}>
                    <input
                        autoFocus
                        placeholder="Tag name..."
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '6px 10px',
                            background: '#222',
                            border: '1px solid #444',
                            borderRadius: '4px',
                            color: 'white',
                            fontSize: '0.8rem',
                            outline: 'none'
                        }}
                    />
                </form>
            )}

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {tags.map((tag) => (
                    <button
                        key={tag.id}
                        onClick={() => onTagSelect(tag.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            padding: '10px 15px',
                            fontSize: '0.85rem',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.2s',
                            background: activeTagId === tag.id ? 'rgba(52, 152, 219, 0.15)' : 'transparent',
                            color: activeTagId === tag.id ? '#3498db' : '#aaa',
                        }}
                    >
                        <Hash size={14} style={{ marginRight: '10px', opacity: 0.5 }} />
                        {tag.name}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default TagList;

