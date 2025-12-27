import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { X, Save, RefreshCw } from 'lucide-react';

const CreateNote = ({ onNoteCreated, onCancel, noteToEdit }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [folderId, setFolderId] = useState('');
    const [folders, setFolders] = useState([]);

    useEffect(() => {
        if (noteToEdit) {
            setTitle(noteToEdit.title);
            setContent(noteToEdit.content);
            setFolderId(noteToEdit.folder_id || '');
        } else {
            setTitle('');
            setContent('');
            setFolderId('');
        }
    }, [noteToEdit]);

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const res = await api.get('/folders');
                setFolders(res.data.data.folders || []);
            } catch (err) {
                console.error('Error fetching folders');
            }
        };
        fetchFolders();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content) return toast.error("Title and content are required");

        const payload = {
            title,
            content,
            folder_id: folderId === "" ? null : Number(folderId),
        };

        try {
            if (noteToEdit) {
                await api.patch(`/notes/${noteToEdit.id}`, payload);
                toast.success('Note updated successfully!');
            } else {
                await api.post('/notes', payload);
                toast.success('Note created successfully!');
            }

            onNoteCreated();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        }
    };

    return (
        <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: `2px solid ${noteToEdit ? '#3498db' : '#2ecc71'}`,
            marginBottom: '30px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <h3>{noteToEdit ? 'Editing Note' : 'Create New Note'}</h3>
                <button onClick={onCancel} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Note Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                />

                <textarea
                    placeholder="Write your note here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{ width: '100%', height: '120px', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd', resize: 'vertical' }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <select
                        value={folderId}
                        onChange={(e) => setFolderId(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                        <option value="">No Folder</option>
                        {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="button" onClick={onCancel} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #ddd', cursor: 'pointer' }}>
                            Cancel
                        </button>
                        <button type="submit" style={{
                            background: noteToEdit ? '#3498db' : '#2ecc71',
                            color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                            {noteToEdit ? <><RefreshCw size={18} /> Update</> : <><Save size={18} /> Save</>}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateNote;

