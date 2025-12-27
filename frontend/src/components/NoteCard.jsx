import { Pin, Archive, Calendar } from 'lucide-react';

const NoteCard = ({ note }) => {
    return (
        <div style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '15px',
            position: 'relative',
            background: note.is_pinned ? '#fff9db' : '#fff'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h3 style={{ margin: 0 }}>{note.title}</h3>
                {note.is_pinned && <Pin size={18} fill="#f1c40f" color="#f1c40f" />}
            </div>

            <p style={{ color: '#666', fontSize: '14px' }}>{note.content}</p>

            <div style={{ display: 'flex', gap: '5px', marginTop: '10px', flexWrap: 'wrap' }}>
                {note.tags?.map(tag => (
                    <span key={tag.id} style={{ fontSize: '10px', background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>
                        #{tag.name}
                    </span>
                ))}
            </div>

            <div style={{ marginTop: '15px', fontSize: '11px', color: '#999', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={12} />
                {new Date(note.updated_at).toLocaleDateString()}
            </div>
        </div>
    );
};

export default NoteCard;

