import { useRef, useEffect, useState } from 'react';
import { renderIcon } from 'gavatar';
import * as PIXI from 'pixi.js';

export default function GDIcon({ form, iconID, col1, col2, glow, glowColor, size = 100, assetsPath = '/assets', className }) {
    const containerRef = useRef(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setError(false);

        const options = { form, iconID, col1, col2, glow, glowColor, size };
        // The renderOptions object accepts assetsPath. 
        // We pass the provided assetsPath (default '/assets' from props)
        const renderOptions = { assetsPath };

        renderIcon(PIXI, options, renderOptions)
            .then((canvas) => {
                if (cancelled || !containerRef.current) return;
                containerRef.current.innerHTML = '';
                containerRef.current.appendChild(canvas);
            })
            .catch((err) => {
                // Fail silently or just set error
                if (!cancelled) setError(true);
            });

        return () => {
            cancelled = true;
        };
    }, [form, iconID, col1, col2, glow, glowColor, size, assetsPath]);

    if (error) return <div style={{ width: size, height: size, background: 'transparent', borderRadius: 8 }} />;
    return <div ref={containerRef} className={className} />;
}
