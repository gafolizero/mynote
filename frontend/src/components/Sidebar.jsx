import { useEffect, useState } from 'react';
import api from '../services/api';
import { Folder, Tag, Plus } from 'lucide-react';

const Sidebar = () => {
    const [folders, setFolders] = useState([]);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const fetchSidebarData = async () => {
            try {
                const folderRes = await api.get('/folders');
                const tagRes = await api.get('/tags');
                setFolders(folderRes.data.data.folders || []);
                setTags(tagRes.data.data.tags || []);
            } catch (err) {
                console.error('Failed to fetch sidebar data', err);
            }
        };
        fetchSidebarData();
    }, []);

    return (
        <aside style={{ width: '250px', background: '#f8f9fa', height: '100vh', padding: '20px', borderRight: '1px solid #ddd' }}>
            <h3>My Folders</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {folders.map(folder => (
                    <li key={folder.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0' }}>
                        <Folder size={18} color={folder.color} />
                        {folder.name}
                    </li>
                ))}
            </ul>

            <h3 style={{ marginTop: '30px' }}>My Tags</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {tags.map(tag => (
                    <span key={tag.id} style={{ background: '#e9ecef', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Tag size={12} />
                        {tag.name}
                    </span>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;

