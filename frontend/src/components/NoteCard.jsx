import { Pin, Calendar, Trash2, Edit3 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const NoteCard = ({ note, onRefresh, onEdit }) => {

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${note.id}`);
      toast.success("Note deleted successfully");
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete note");
    }
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      background: note.is_pinned ? '#fff9db' : '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>{note.title}</h3>
          {note.is_pinned && <Pin size={16} fill="#f1c40f" color="#f1c40f" />}
        </div>
        <p style={{ color: '#444', fontSize: '14px', whiteSpace: 'pre-wrap' }}>{note.content}</p>
      </div>

      <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#999', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={12} /> {new Date(note.updated_at).toLocaleDateString()}
          </span>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onEdit(note)}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#3498db' }}
              title="Edit Note" >

              <Edit3 size={18} />
            </button>
            <button
              onClick={handleDelete}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#e74c3c' }}
              title="Delete Note" >

              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;

