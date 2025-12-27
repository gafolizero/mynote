import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { X, Save } from 'lucide-react';

const CreateNote = ({ onNoteCreated, onCancel }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [folderId, setFolderId] = useState('');
    const [folders, setFolders] = useState([]);

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const res = await api.get('/folders');
                setFolders(res.data.data.folders);
            } catch (err) {
                console.error('Error loading folders');
            }
        };
        fetchFolders();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content) return toast.error("Please fill in title and content");

        try {
            const payload = {
                title,
                content,
                folder_id: folderId === "" ? null : Number(folderId),
            };

            await api.post('/notes', payload);

            toast.success('Note created!');
            onNoteCreated();
        } catch (err) {
            console.error("Backend Error:", err.response?.data);
            toast.error(err.response?.data?.message || 'Failed to create note');
        }
    };

    return (
        <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #ddd',
            marginBottom: '30px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <h3>New Note</h3>
                <button onClick={onCancel} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20}/></button>
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
                    style={{ width: '100%', height: '100px', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                />

                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <select
                        value={folderId}
                        onChange={(e) => setFolderId(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} >

                        <option value="">Select Folder (Optional)</option>
                        {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                </div>

                <button type="submit" style={{
                    background: '#2ecc71', color: 'white', border: 'none',
                    padding: '10px 20px', borderRadius: '6px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                    <Save size={18} /> Save Note
                </button>
            </form>
        </div>
    );
};

export default CreateNote;

