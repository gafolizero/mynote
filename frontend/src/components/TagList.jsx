import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Hash, X } from 'lucide-react';
import toast from 'react-hot-toast';

const TagList = ({ activeTagId, onTagSelect }) => {
    const [tags, setTags] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [tagError, setTagError] = useState('');

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const res = await api.get('/tags');
            if (res.data?.data?.tags) setTags(res.data.data.tags);
        } catch (err) {
            console.error("Error loading tags", err);
            toast.error(err.response?.data?.message || 'Failed to load tags');
        }
    };

    const validateTagName = (name) => {
        const trimmed = name.trim();
        if (!trimmed) {
            return 'Tag name is required';
        }
        if (trimmed.length > 50) {
            return 'Tag name must not exceed 50 characters';
        }
        return null;
    };

    const handleTagNameChange = (e) => {
        const value = e.target.value;
        setNewTagName(value);
        setTagError('');

        if (value.trim().length > 50) {
            setTagError('Tag name must not exceed 50 characters');
        }
    };

    const handleCreateTag = async (e) => {
        e.preventDefault();
        setTagError('');

        const error = validateTagName(newTagName);
        if (error) {
            setTagError(error);
            toast.error(error);
            return;
        }

        try {
            await api.post('/tags', { name: newTagName.trim() });
            setNewTagName('');
            setIsCreating(false);
            setTagError('');
            fetchTags();
            toast.success('Tag created successfully');
        } catch (err) {
            console.error("Error creating tag", err);
            const errorMessage = err.response?.data?.message || 'Failed to create tag';
            toast.error(errorMessage);
            setTagError(errorMessage);
        }
    };

    return (
        <div style={{ marginTop: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#8B96C7', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Tags
                </h3>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    style={{ background: 'none', border: 'none', color: '#8B96C7', cursor: 'pointer' }}
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
                        onChange={handleTagNameChange}
                        maxLength={50}
                        style={{
                            width: '100%',
                            padding: '6px 10px',
                            background: '#F4EEFF',
                            border: tagError ? '1px solid #e74c3c' : '1px solid #DCD6F7',
                            borderRadius: '4px',
                            color: '#424874',
                            fontSize: '0.8rem',
                            outline: 'none'
                        }}
                    />
                    {tagError && (
                        <p style={{
                            color: '#e74c3c',
                            fontSize: '0.65rem',
                            marginTop: '4px',
                            marginBottom: 0
                        }}>
                            {tagError}
                        </p>
                    )}
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
                            background: activeTagId === tag.id ? '#DCD6F7' : 'transparent',
                            color: activeTagId === tag.id ? '#424874' : '#8B96C7',
                        }}
                    >
                        <Hash size={14} style={{ marginRight: '10px', opacity: 0.6 }} />
                        {tag.name}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default TagList;

