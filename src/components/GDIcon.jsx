import { useRef, useEffect, useState } from 'react';
import { renderIcon } from 'gavatar';
import * as PIXI from 'pixi.js';

export default function GDIcon({ form = 'cube', iconID = 1, col1 = 0, col2 = 3, glow = false, glowColor = null, size = 100, assetsPath = '', className = '' }) {
    const containerRef = useRef(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        setError(false);
        setLoading(true);

        const options = { form, iconID, col1, col2, glow, glowColor, size };
        // Only include assetsPath if it's provided, otherwise let library default or fallback
        const renderOptions = assetsPath ? { assetsPath } : {};

        renderIcon(PIXI, options, renderOptions)
            .then((canvas) => {
                if (cancelled || !containerRef.current) return;
                containerRef.current.innerHTML = '';
                containerRef.current.appendChild(canvas);
            })
            .catch((err) => {
                console.error("GDIcon rendering error. Check if assets are available at:", assetsPath || '/assets', err);
                if (!cancelled) setError(true);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [form, iconID, col1, col2, glow, glowColor, size, assetsPath]);

    if (error) return (
        <div style={{
            width: size,
            height: size,
            background: 'rgba(255, 0, 0, 0.2)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ff6b6b',
            fontSize: '10px'
        }}>
            !
        </div>
    );

    if (loading) return (
        <div style={{
            width: size,
            height: size,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 8,
            animation: 'pulse 1.5s infinite'
        }} />
    );

    return <div ref={containerRef} className={className} style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />;
}
