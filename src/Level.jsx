import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layers } from 'lucide-react';
import './styles/Level.css';

const Level = () => {
    const { levelIdOrName } = useParams();
    const [levelData, setLevelData] = useState(null);
    const [sendStats, setSendStats] = useState(null);
    const [voteStats, setVoteStats] = useState(null);
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

                try {
                    const sendsResponse = await fetch(`/v1/getLevelSends?levelId=${data.levelId}`);
                    if (sendsResponse.ok) {
                        const sendsData = await sendsResponse.json();
                        setSendStats(sendsData);
                    }
                } catch (sendsErr) {
                    console.error("Error fetching send stats:", sendsErr);
                }

                try {
                    const votesResponse = await fetch('/v1/getVotes', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ levelId: data.levelId })
                    });
                    if (votesResponse.ok) {
                        const votesData = await votesResponse.json();
                        setVoteStats(votesData);
                    }
                } catch (votesErr) {
                    console.error("Error fetching vote stats:", votesErr);
                }
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

            {loading && <div className="loading-level glass" style={{ textAlign: 'center' }}>Loading level details...</div>}

            {error && (
                <div className="loading-level-error glass" style={{ textAlign: 'center', color: '#ff4444' }}>
                    <p>{error}</p>
                    <div className="level-actions" style={{ marginTop: '1rem' }}>
                        <a
                            href={/^\d+$/.test(levelIdOrName) ? `https://gdbrowser.com/${levelIdOrName}` : `https://gdbrowser.com/search/${levelIdOrName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="play-gdbrowser-btn"
                        >
                            View on GDBrowser
                        </a>
                    </div>
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

                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <div style={{ flex: '1', minWidth: '400px' }}>
                            <h3 className="level-stats-title" data-text="LEVEL INFO">LEVEL INFO</h3>
                            <div className="level-stats-grid" style={{ marginBottom: 0 }}>
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
                                        <span className="stat-value" style={{ color: '#ffde74ff' }}>{levelData.featuredScore}</span>
                                    </div>
                                )}
                                <div className="stat-card">
                                    <span className="stat-label">Game Type</span>
                                    <span className="stat-value" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        {getTypeIcon(levelData.type) && (
                                            <img src={getTypeIcon(levelData.type)} alt={levelData.type} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                                        )}
                                        {levelData.type}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {sendStats && (
                            <div style={{ flex: '1', minWidth: '400px' }}>
                                <h3 className="level-stats-title" data-text="SEND STATS">SEND STATS</h3>
                                <div className="level-stats-grid" style={{ marginBottom: 0 }}>
                                    <div className="stat-card">
                                        <span className="stat-label">Total Sends</span>
                                        <span className="stat-value">{sendStats.suggestedTotal || 0}</span>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-label" style={{ color: '#ffc400ff' }}>Featured Sends</span>
                                        <span className="stat-value">{sendStats.suggestedFeatured || 0}</span>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-label" style={{ color: '#80effdff' }}>Epic Sends</span>
                                        <span className="stat-value">{sendStats.suggestedEpic || 0}</span>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-label" style={{ color: '#ff90ff' }}>Legendary Sends</span>
                                        <span className="stat-value">{sendStats.suggestedLegendary || 0}</span>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-label" style={{ color: '#ff6b6b' }}>Rejections</span>
                                        <span className="stat-value" style={{ color: sendStats.rejectedTotal > 0 ? '#ff6b6b' : 'inherit' }}>
                                            {sendStats.rejectedTotal || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {voteStats && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 className="level-stats-title" data-text="VOTE STATS">VOTE STATS</h3>
                            <div className="level-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                                <div className="stat-card">
                                    <span className="stat-label">Total Votes</span>
                                    <span className="stat-value">{voteStats.totalVotes || 0}</span>
                                </div>
                                <div className="stat-card">
                                    <span className="stat-label">Avg Gameplay</span>
                                    <span className="stat-value">{voteStats.gameplayScore?.toFixed(2) || '0.00'}/10</span>
                                </div>
                                <div className="stat-card">
                                    <span className="stat-label">Avg Originality</span>
                                    <span className="stat-value">{voteStats.originalityScore?.toFixed(2) || '0.00'}/10</span>
                                </div>
                                <div className="stat-card">
                                    <span className="stat-label">Avg Difficulty</span>
                                    <span className="stat-value">{voteStats.difficultyScore?.toFixed(2) || '0.00'}/30</span>
                                </div>
                            </div>
                        </div>
                    )}

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
            )
            }
        </div >
    );
};

export default Level;
