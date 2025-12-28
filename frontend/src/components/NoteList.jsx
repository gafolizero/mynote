import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import NoteCard from './NoteCard';
import SkeletonCard from './SkeletonCard';
import { FileText } from 'lucide-react';

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
            if (folderId === 'unorganized') params.append('folder_id', 'null');
                else if (folderId) params.append('folder_id', folderId);

            const response = await api.get(`/notes?${params.toString()}`);
            setNotes(response.data.data.notes || []);
        } catch (err) {
            console.error('Error fetching notes:', err);
        } finally {
            setLoading(false);
        }
    }, [page, searchQuery, folderId, tagId, isArchived]);

    useEffect(() => { setPage(1); }, [searchQuery, folderId, tagId, isArchived]);
    useEffect(() => { fetchNotes(); }, [fetchNotes]);

    return (
        <div style={{ position: 'relative', minHeight: '400px' }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px'
            }}>
                {loading ? (
                    [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
                ) : (
                        <>
                            {notes.length > 0 ? (
                                notes.map(note => (
                                    <NoteCard key={note.id} note={note} onRefresh={fetchNotes} onEdit={onEditNote} />
                                ))
                            ) : (
                                    /* --- EMPTY STATE --- */
                                    <div style={{
                                        gridColumn: '1/-1', textAlign: 'center', padding: '80px 20px',
                                        background: '#fff', borderRadius: '15px', border: '1px dashed #ddd'
                                    }}>
                                        <div style={{ background: '#f9f9f9', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                            <FileText size={30} color="#ccc" />
                                        </div>
                                        <h3 style={{ color: '#555', marginBottom: '10px' }}>No notes found</h3>
                                        <p style={{ color: '#888', fontSize: '0.9rem' }}>
                                            {isArchived
                                                ? "Your archive is currently empty."
                                                : "Start your journey by creating your first note!"}
                                        </p>
                                    </div>
                                )}
                        </>
                    )}
            </div>

            {!loading && notes.length > 0 && (
                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer', background: '#fff' }}>Prev</button>
                    <span style={{ fontWeight: '600', color: '#666' }}>Page {page}</span>
                    <button disabled={notes.length < limit} onClick={() => setPage(p => p + 1)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer', background: '#fff' }}>Next</button>
                </div>
            )}
        </div>
    );
};

export default NoteList;

