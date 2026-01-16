import { useState, useEffect } from 'react';
import LayoutBrowser from './components/LayoutBrowser';
import './styles/Gauntlets.css';

const Gauntlets = () => {
    const [gauntlets, setGauntlets] = useState([]);
    const [selectedGauntlet, setSelectedGauntlet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGauntlets = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://gdrate.arcticwoof.xyz/v1/getGauntlets');
                if (!response.ok) {
                    throw new Error('Failed to fetch gauntlets');
                }
                const data = await response.json();
                setGauntlets(data);

                // Select first gauntlet by default if available
                if (data.length > 0) {
                    setSelectedGauntlet(data[0]);
                }
            } catch (err) {
                console.error("Error fetching gauntlets:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGauntlets();
    }, []);

    return (
        <div className="container">
            <h1 className="page-title">
                <img src="/RL_gauntlet-2.png" alt="" className="page-title-icon" onError={(e) => { e.target.style.display = 'none' }} />
                Layout Gauntlets
            </h1>

            {loading && <div className="layout-browser-loading glass" style={{ margin: '2rem auto', width: 'fit-content', padding: '1rem 3rem' }}>Loading Gauntlets...</div>}
            {error && <div className="layout-browser-loading glass" style={{ margin: '2rem auto', width: 'fit-content', padding: '1rem 3rem', color: 'red' }}>Error: {error}</div>}

            {!loading && !error && (
                <div className="gauntlets-container">
                    <div className="gauntlets-sidebar">
                        {gauntlets.map((g) => (
                            <div
                                key={g.gauntletId}
                                className={`gauntlet-item glass ${selectedGauntlet?.gauntletId === g.gauntletId ? 'selected' : ''}`}
                                onClick={() => setSelectedGauntlet(g)}
                            >
                                <img
                                    src={`/RL_gauntlet-${g.gauntletId}.png`}
                                    alt={g.gauntletName}
                                    className="gauntlet-icon"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/RL_gauntlet-1.png';
                                    }}
                                />
                                <div className="gauntlet-info">
                                    <span className="gauntlet-name">{g.gauntletName}</span>
                                    <div className="gauntlet-difficulty">
                                        <span>{g.minDifficulty}-{g.maxDifficulty}</span>
                                        <img src="/RL_sparkMed.png" alt="Difficulty" className="difficulty-spark" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="gauntlets-main">
                        {selectedGauntlet ? (
                            <LayoutBrowser layouts={selectedGauntlet.layouts} />
                        ) : (
                            <div style={{ padding: '2rem', textAlign: 'center' }}>Select a gauntlet to view layouts</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gauntlets;
