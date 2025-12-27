import { useEffect, useState } from 'react';
import api from '../services/api';
import NoteCard from './NoteCard';

const NoteList = ({ searchQuery, folderId, onEditNote }) => {
    const [notes, setNotes] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const limit = 6;

    const fetchNotes = async () => {
        setLoading(true);
        try {
            let queryParams = `page=${page}&limit=${limit}`;

            if (searchQuery) {
                queryParams += `&search=${searchQuery}`;
            }

            if (folderId) {
                queryParams += `&folder_id=${folderId}`;
            }

            const response = await api.get(`/notes?${queryParams}`);

            setNotes(response.data.data.notes || []);
        } catch (err) {
            console.error('Error fetching notes:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
    }, [searchQuery, folderId]);

    useEffect(() => {
        fetchNotes();
    }, [page, searchQuery, folderId]);

    return (
        <div>
            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
                    <p>Syncing your notes...</p>
                </div>
            ) : (
                    <>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '25px'
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
                                    <div style={{
                                        gridColumn: '1/-1',
                                        textAlign: 'center',
                                        padding: '60px',
                                        background: '#fff',
                                        borderRadius: '12px',
                                        border: '1px dashed #ccc'
                                    }}>
                                        <p style={{ color: '#888' }}>No notes found in this view.</p>
                                    </div>
                                )}
                        </div>

                        {/* Pagination bar */}
                        {notes.length > 0 && (
                            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                    style={{ padding: '8px 16px', borderRadius: '6px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                                >
                                    Previous
                                </button>
                                <span style={{ fontWeight: 'bold' }}>Page {page}</span>
                                <button
                                    disabled={notes.length < limit}
                                    onClick={() => setPage(p => p + 1)}
                                    style={{ padding: '8px 16px', borderRadius: '6px', cursor: notes.length < limit ? 'not-allowed' : 'pointer' }}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
        </div>
    );
};

export default NoteList;
