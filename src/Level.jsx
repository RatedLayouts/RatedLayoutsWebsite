import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layers } from 'lucide-react';
import './styles/Level.css';

const Level = () => {
    const { levelIdOrName } = useParams();
    const [levelData, setLevelData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLevel = async () => {
            setLoading(true);
            setError(null);
            try {
                // Determine if param is numeric ID or string name
                const isNumericId = /^\d+$/.test(levelIdOrName);
                const body = isNumericId
                    ? { levelid: Number(levelIdOrName) }
                    : { levelname: levelIdOrName };

                const response = await fetch('/v1/getLevel', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Level not found');
                    }
                    throw new Error('Failed to fetch level details');
                }

                const data = await response.json();
                setLevelData(data);
            } catch (err) {
                console.error("Error fetching level:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (levelIdOrName) {
            fetchLevel();
        }
    }, [levelIdOrName]);

    const getDifficultyAsset = (diff) => {
        if (diff === 1) return '/difficulty/difficulty_auto.png';
        if (diff === 2) return '/difficulty/difficulty_easy.png';
        if (diff === 3) return '/difficulty/difficulty_normal.png';
        if (diff === 4 || diff === 5) return '/difficulty/difficulty_hard.png';
        if (diff >= 6 && diff <= 7) return '/difficulty/difficulty_harder.png';
        if (diff >= 8 && diff <= 9) return '/difficulty/difficulty_insane.png';
        if (diff === 10) return '/difficulty/difficulty_easy_demon.png';
        if (diff === 15) return '/difficulty/difficulty_medium_demon.png';
        if (diff === 20) return '/difficulty/difficulty_hard_demon.png';
        if (diff === 25) return '/difficulty/difficulty_insane_demon.png';
        if (diff === 30) return '/difficulty/difficulty_extreme_demon.png';
        return '/difficulty/difficulty_auto.png';
    };

    const getFeaturedCoinAsset = (featured) => {
        if (featured === 1) return '/RL_featuredCoin.png';
        if (featured === 2) return '/RL_epicFeaturedCoin.png';
        if (featured === 3) return '/RL_legendaryFeaturedCoin.png';
        return null;
    };

    const getTypeIcon = (type) => {
        if (type === "classic") return '/RL_sparkMed.png';
        if (type === "platformer") return '/RL_planetMed.png';
        return null;
    };

    const isDemon = (diff) => [10, 15, 20, 25, 30].includes(diff);
    const difficulty = levelData?.difficulty || 0;
    const isDemonValue = isDemon(difficulty);

    return (
        <div className="container">
            <h1 className="page-title">
                Level Details
            </h1>

            {loading && <div className="loading-level glass" style={{ textAlign: 'center' }}>Loading level details...</div>}

            {error && (
                <div className="loading-level-error glass" style={{ textAlign: 'center', color: '#ff4444' }}>
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && levelData && (
                <div className="level-details-card glass">
                    <div className="level-main-info">
                        <div className="level-difficulty-huge">
                            {getFeaturedCoinAsset(levelData.featured) && (
                                <img
                                    src={getFeaturedCoinAsset(levelData.featured)}
                                    alt="Featured Rating"
                                    className={`featured-coin-bg-huge ${levelData.featured === 2 ? 'epic-coin' : ''} ${levelData.featured === 3 ? 'legendary-coin' : ''}`}
                                />
                            )}
                            <img
                                src={getDifficultyAsset(difficulty)}
                                alt={`Difficulty ${difficulty}`}
                                className={`difficulty-icon-huge ${isDemonValue ? 'difficulty-icon-demon-huge' : ''}`}
                            />
                        </div>

                        <div className="level-header-huge">
                            <h2 className="level-name-huge" data-text={levelData.levelName}>{levelData.levelName}</h2>
                            <div className="level-creator-huge">
                                <Link
                                    to={`/user/${levelData.creatorAccountId || levelData.creatorUsername}`}
                                    className="level-creator-huge-link"
                                    data-text={`by ${levelData.creatorUsername}`}
                                >
                                    by {levelData.creatorUsername}
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="level-stats-grid">
                        <div className="stat-card">
                            <span className="stat-label">Level ID</span>
                            <span className="stat-value">{levelData.levelId}</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">Difficulty</span>
                            <span className="stat-value">{difficulty}</span>
                        </div>
                        {levelData.featuredScore !== undefined && (
                            <div className="stat-card">
                                <span className="stat-label">Featured Score</span>
                                <span className="stat-value">{levelData.featuredScore}</span>
                            </div>
                        )}
                        <div className="stat-card">
                            <span className="stat-label">Game Type</span>
                            <span className="stat-value" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                {levelData.type}
                                {getTypeIcon(levelData.type) && (
                                    <img src={getTypeIcon(levelData.type)} alt={levelData.type} style={{ width: '20px', height: '20px' }} />
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="level-actions">
                        <a
                            href={`https://gdbrowser.com/${levelData.levelId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="play-gdbrowser-btn"
                        >
                            View on GDBrowser
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Level;
