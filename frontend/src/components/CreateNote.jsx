import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { X, Save, Hash } from 'lucide-react';

const CreateNote = ({ noteToEdit, onNoteCreated, onCancel }) => {
    const [title, setTitle] = useState(noteToEdit?.title || '');
    const [content, setContent] = useState(noteToEdit?.content || '');

    const [folderId, setFolderId] = useState(noteToEdit?.folder_id || '');
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(false);

    const [allTags, setAllTags] = useState([]);
    const [selectedTagIds, setSelectedTagIds] = useState([]);

    useEffect(() => {
        fetchFolders();
        fetchAllTags();
        if (noteToEdit && noteToEdit.tags) {
            setSelectedTagIds(noteToEdit.tags.map(t => t.id));
        }
    }, [noteToEdit]);

    const fetchFolders = async () => {
        try {
            const res = await api.get('/folders');
            setFolders(res.data.data.folders || []);
        } catch (err) { console.error(err); }
    };

    const fetchAllTags = async () => {
        try {
            const res = await api.get('/tags');
            setAllTags(res.data.data.tags || []);
        } catch (err) { console.error(err); }
    };

    const handleTagChange = (e) => {
        const val = parseInt(e.target.value);
        if (val && !selectedTagIds.includes(val)) {
            setSelectedTagIds([...selectedTagIds, val]);
        }
        e.target.value = "";
    };

    const removeTag = (id) => {
        setSelectedTagIds(selectedTagIds.filter(tagId => tagId !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let sanitizedFolderId = null;
        if (folderId && folderId !== '' && folderId !== 'null') {
            sanitizedFolderId = !isNaN(folderId) ? parseInt(folderId) : folderId;
        }

        const noteData = {
            title,
            content,
            folder_id: sanitizedFolderId,
            tagIds: selectedTagIds
        };

        console.log("SENDING DATA TO BACKEND:", noteData);

        try {
            if (noteToEdit) {
                await api.patch(`/notes/${noteToEdit.id}`, noteData);
            } else {
                await api.post('/notes', noteData);
            }
            onNoteCreated();
        } catch (err) {
            console.error('SERVER ERROR DETAILS:', err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '30px', border: '1px solid #eee' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.1rem', color: '#333' }}>
                {noteToEdit ? 'Edit Note' : 'Create New Note'}
            </h3>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Note Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
                />

                <textarea
                    placeholder="Write your note here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    style={{ width: '100%', height: '150px', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', resize: 'none' }}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '10px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>Folder</label>
                        <select
                            value={folderId}
                            onChange={(e) => setFolderId(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                        >
                            <option value="">No Folder</option>
                            {folders.map(f => (
                                <option key={f.id} value={f.id}>{f.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>Add Tag</label>
                        <select
                            onChange={handleTagChange}
                            defaultValue=""
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                        >
                            <option value="" disabled>Choose tags...</option>
                            {allTags.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px', minHeight: '32px' }}>
                    {selectedTagIds.map(id => {
                        const tag = allTags.find(t => t.id === id);
                        if (!tag) return null;
                        return (
                            <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f0f4f8', color: '#3498db', padding: '4px 10px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: '500', border: '1px solid #d1e3f3' }}>
                                <Hash size={12} /> {tag.name}
                                <button type="button" onClick={() => removeTag(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><X size={14} /></button>
                            </div>
                        );
                    })}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" disabled={loading} style={{ background: '#3498db', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                        <Save size={18} style={{ marginRight: '8px' }} /> {loading ? 'Saving...' : 'Save Note'}
                    </button>
                    <button type="button" onClick={onCancel} style={{ background: '#eee', color: '#666', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default CreateNote;

