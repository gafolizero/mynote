// NoteList.jsx
import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import NoteCard from './NoteCard';

const NoteList = ({ searchQuery, folderId, tagId, onEditNote }) => {
    const [notes, setNotes] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const limit = 6;

    const fetchNotes = useCallback(async () => {
        setLoading(true);
        try {
            let params = new URLSearchParams();
            params.append('page', page);
            params.append('limit', limit);

            if (searchQuery) params.append('search', searchQuery);
            if (tagId) params.append('tagId', tagId);

            if (folderId === 'unorganized') {
                params.append('folder_id', 'null');
            } else if (folderId) {
                params.append('folder_id', folderId);
            }

            const response = await api.get(`/notes?${params.toString()}`);
            setNotes(response.data.data.notes || []);
        } catch (err) {
            console.error('Error fetching notes:', err);
        } finally {
            setLoading(false);
        }
    }, [page, searchQuery, folderId, tagId]); // Dependencies are strictly external props

    // Reset to page 1 ONLY when filters change, NOT when page changes
    useEffect(() => {
        setPage(1);
    }, [searchQuery, folderId, tagId]);

    // Fetch notes when anything changes
    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    return (
        <div style={{ position: 'relative', minHeight: '200px' }}>
            {loading && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, textAlign: 'center', background: 'rgba(250,250,250,0.8)', zIndex: 10, padding: '20px' }}>
                    <p style={{ color: '#3498db', fontWeight: 'bold' }}>Updating...</p>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px', opacity: loading ? 0.5 : 1 }}>
                {notes.length > 0 ? (
                    notes.map(note => (
                        <NoteCard key={note.id} note={note} onRefresh={fetchNotes} onEdit={onEditNote} />
                    ))
                ) : (
                    !loading && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '12px', border: '1px dashed #ccc' }}>
                            <p style={{ color: '#888' }}>No notes found.</p>
                        </div>
                    )
                )}
            </div>

            {notes.length > 0 && (
                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Previous</button>
                    <span style={{ fontWeight: 'bold' }}>Page {page}</span>
                    <button disabled={notes.length < limit} onClick={() => setPage(p => p + 1)} style={{ padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Next</button>
                </div>
            )}
        </div>
    );
};

export default NoteList;

