import { useEffect, useState } from 'react';
import api from '../services/api';
import NoteCard from './NoteCard';

const NoteList = ({ searchQuery }) => { // Receive searchQuery prop
    const [notes, setNotes] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const limit = 5;

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/notes?page=${page}&limit=${limit}&search=${searchQuery}`);
            setNotes(response.data.data.notes);
        } catch (err) {
            console.error('Error fetching notes:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    useEffect(() => {
        fetchNotes();
    }, [page, searchQuery]);

    return (
        <div>
            {loading ? (
                <p>Searching...</p>
            ) : (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {notes.length > 0 ? (
                                notes.map(note => <NoteCard key={note.id} note={note} />)
                            ) : (
                                    <p style={{ color: '#888' }}>No notes found matching your search.</p>
                                )}
                        </div>

                        <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
                            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
                            <span>Page {page}</span>
                            <button disabled={notes.length < limit} onClick={() => setPage(p => p + 1)}>Next</button>
                        </div>
                    </>
                )}
        </div>
    );
};

export default NoteList;

