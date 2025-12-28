import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import NoteCard from './NoteCard';

const NoteList = ({ searchQuery, folderId, tagId, isArchived, onEditNote }) => {
    const [notes, setNotes] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const limit = 9;

    const fetchNotes = useCallback(async () => {
        setLoading(true);
        try {
            let params = new URLSearchParams();
            params.append('page', page);
            params.append('limit', limit);

            params.append('isArchived', isArchived ? 'true' : 'false');

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
    }, [page, searchQuery, folderId, tagId, isArchived]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery, folderId, tagId, isArchived]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    return (
        <div style={{ position: 'relative', minHeight: '200px' }}>
            {loading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p style={{ color: '#3498db', fontWeight: 'bold' }}>Loading notes...</p>
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
                opacity: loading ? 0.6 : 1
            }}>
                {notes.length > 0 ? (
                    notes.map(note => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            onRefresh={fetchNotes}
                            onEdit={onEditNote}
                        />
                    ))
                ) : (
                        !loading && (
                            <div style={{
                                gridColumn: '1/-1',
                                textAlign: 'center',
                                padding: '60px',
                                background: '#fff',
                                borderRadius: '12px',
                                border: '1px dashed #ccc'
                            }}>
                                <p style={{ color: '#888' }}>
                                    No {isArchived ? 'archived' : 'active'} notes found.
                                </p>
                            </div>
                        )
                    )}
            </div>

            {notes.length > 0 && (
                <div style={{
                    marginTop: '30px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        style={{ padding: '8px 16px', cursor: 'pointer' }}
                    >
                        Previous
                    </button>
                    <span style={{ fontWeight: 'bold' }}>Page {page}</span>
                    <button
                        disabled={notes.length < limit}
                        onClick={() => setPage(p => p + 1)}
                        style={{ padding: '8px 16px', cursor: 'pointer' }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default NoteList;

