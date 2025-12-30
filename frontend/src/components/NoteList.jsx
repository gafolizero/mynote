import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import NoteCard from './NoteCard';
import SkeletonCard from './SkeletonCard';
import { FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const NoteList = ({ searchQuery, folderId, tagId, isArchived, sortBy, sortOrder, onEditNote }) => {
    const [notes, setNotes] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const limit = 6;

    const fetchNotes = useCallback(async () => {
        setLoading(true);
        try {
            let params = new URLSearchParams();
            params.append('page', page);
            params.append('limit', limit);
            params.append('isArchived', isArchived ? 'true' : 'false');

            if (tagId) {
                params.append('tagId', tagId);
            }

            if (searchQuery) params.append('search', searchQuery);

            if (folderId === 'unorganized') {
                params.append('folder_id', 'null');
            } else if (folderId) {
                params.append('folder_id', folderId);
            }

            if (sortBy) {
                params.append('sortBy', sortBy);
            }

            if (sortOrder) {
                params.append('sortOrder', sortOrder);
            }

            const response = await api.get(`/notes?${params.toString()}`);
            const fetchedNotes = response.data.data.notes || [];
            setNotes(fetchedNotes);

            setHasMore(fetchedNotes.length === limit);
        } catch (err) {
            console.error('Error fetching notes:', err);
            setNotes([]);
            setHasMore(false);
            if (err.response?.status !== 401) {
                toast.error(err.response?.data?.message || 'Failed to load notes');
            }
        } finally {
            setLoading(false);
        }
    }, [page, searchQuery, folderId, tagId, isArchived, sortBy, sortOrder, limit]);

    useEffect(() => { setPage(1); }, [searchQuery, folderId, tagId, isArchived, sortBy, sortOrder]);
    useEffect(() => { fetchNotes(); }, [fetchNotes]);

    return (
        <div style={{ position: 'relative', minHeight: '400px', paddingBottom: '100px' }}>
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
                                    <div style={{
                                        gridColumn: '1/-1', textAlign: 'center', padding: '80px 20px',
                                        background: '#F4EEFF', borderRadius: '15px', border: '1px dashed #DCD6F7'
                                    }}>
                                        <div style={{ background: '#DCD6F7', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                            <FileText size={30} color="#8B96C7" />
                                        </div>
                                        <h3 style={{ color: '#424874', marginBottom: '10px' }}>No notes found</h3>
                                        <p style={{ color: '#8B96C7', fontSize: '0.9rem' }}>
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
                <div style={{
                    marginTop: '40px',
                    marginBottom: '60px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '20px 0'
                }}>
                    <button
                        disabled={page === 1}
                        onClick={() => {
                            setPage(p => p - 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '8px',
                            border: '1px solid #DCD6F7',
                            cursor: page === 1 ? 'not-allowed' : 'pointer',
                            background: page === 1 ? '#A6B1E1' : '#F4EEFF',
                            color: page === 1 ? '#F4EEFF' : '#424874',
                            fontWeight: '600',
                            fontSize: '14px',
                            transition: 'all 0.2s',
                            boxShadow: page === 1 ? 'none' : '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                    >
                        Previous
                    </button>
                    <div style={{
                        padding: '10px 20px',
                        background: '#424874',
                        borderRadius: '8px',
                        border: '1px solid #424874',
                        minWidth: '100px',
                        textAlign: 'center'
                    }}>
                        <span style={{ fontWeight: '600', color: '#F4EEFF', fontSize: '14px' }}>
                            Page {page}
                        </span>
                    </div>
                    <button
                        disabled={!hasMore}
                        onClick={() => {
                            setPage(p => p + 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '8px',
                            border: '1px solid #DCD6F7',
                            cursor: !hasMore ? 'not-allowed' : 'pointer',
                            background: !hasMore ? '#A6B1E1' : '#F4EEFF',
                            color: !hasMore ? '#F4EEFF' : '#424874',
                            fontWeight: '600',
                            fontSize: '14px',
                            transition: 'all 0.2s',
                            boxShadow: !hasMore ? 'none' : '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default NoteList;

