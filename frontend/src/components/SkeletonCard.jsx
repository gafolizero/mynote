import React from 'react';

const SkeletonCard = () => {
    return (
        <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #eee',
            height: '180px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div className="skeleton-pulse">
                <div style={{ width: '60%', height: '18px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '15px' }}></div>

                <div style={{ width: '100%', height: '12px', background: '#f5f5f5', borderRadius: '4px', marginBottom: '8px' }}></div>
                <div style={{ width: '90%', height: '12px', background: '#f5f5f5', borderRadius: '4px', marginBottom: '8px' }}></div>
                <div style={{ width: '40%', height: '12px', background: '#f5f5f5', borderRadius: '4px' }}></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <div style={{ width: '20px', height: '20px', background: '#f0f0f0', borderRadius: '4px' }}></div>
                <div style={{ width: '20px', height: '20px', background: '#f0f0f0', borderRadius: '4px' }}></div>
            </div>

            <style>{`
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.4; }
                    100% { opacity: 1; }
                }
                .skeleton-pulse {
                    animation: pulse 1.5s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default SkeletonCard;

