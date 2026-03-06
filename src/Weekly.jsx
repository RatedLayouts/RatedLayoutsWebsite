import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/LayoutBrowser.css';

const Weekly = () => {
    const [weeklyLevels, setWeeklyLevels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeekly = async () => {
            try {
                setLoading(true);
                const response = await fetch('/v1/getWeekly');
                if (!response.ok) {
                    throw new Error('Failed to fetch weekly levels');
                }
                const data = await response.json();
                if (data && data.layouts) {
                    // Calculate expiry time for each level to keep timers in sync
                    const levelsWithExpiry = data.layouts.map(level => ({
                        ...level,
                        expiryTime: Date.now() + (level.timeLeft * 1000)
                    }));
                    setWeeklyLevels(levelsWithExpiry);
                }
            } catch (err) {
                console.error("Error fetching weekly:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeekly();
    }, []);

    return (
        <div className="container">
            <h1 className="page-title">Weekly Layouts</h1>
            {loading && weeklyLevels.length === 0 ? (
                <div className="layout-browser-loading glass" style={{ margin: '2rem auto', width: 'fit-content', padding: '1rem 3rem' }}>
                    Loading weekly levels...
                </div>
            ) : error ? (
                <div className="layout-browser-error glass" style={{ margin: '2rem auto', width: 'fit-content', padding: '1rem 3rem' }}>
                    Error: {error}
                </div>
            ) : (
                <div className="layout-browser-container glass" style={{ margin: '0 auto' }}>
                    {weeklyLevels.map(level => (
                        <WeeklyLevelCard key={level.levelId} level={level} />
                    ))}
                </div>
            )}
        </div>
    );
};

const WeeklyLevelCard = ({ level }) => {
    const [timeLeft, setTimeLeft] = useState(Math.max(0, Math.floor((level.expiryTime - Date.now()) / 1000)));

    useEffect(() => {
        const interval = setInterval(() => {
            const secondsRemaining = Math.max(0, Math.floor((level.expiryTime - Date.now()) / 1000));
            setTimeLeft(secondsRemaining);
            if (secondsRemaining <= 0) {
                clearInterval(interval);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [level.expiryTime]);

    const formatTime = (seconds) => {
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor((seconds % (3600 * 24)) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        // Format: dd:hh:mm:ss
        const pad = (num) => num.toString().padStart(2, '0');
        return `${pad(d)}:${pad(h)}:${pad(m)}:${pad(s)}`;
    };

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

    const getFeaturedCoin = (featured) => {
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

    return (
        <div className="level-card glass weekly-hue" style={{ flexDirection: 'column', alignItems: 'stretch', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <span className="featured-score">Featured Score: {level.featuredScore}</span>
                <div className="level-difficulty-container">
                    {getFeaturedCoin(level.featured) && (
                        <img
                            src={getFeaturedCoin(level.featured)}
                            alt="Featured Coin"
                            className={`featured-coin-bg ${level.featured === 2 ? 'epic-coin' : ''} ${level.featured === 3 ? 'legendary-coin' : ''}`}
                        />
                    )}
                    <img
                        src={getDifficultyAsset(level.difficulty)}
                        alt={`Difficulty ${level.difficulty}`}
                        className={`difficulty-icon ${isDemon(level.difficulty) ? 'difficulty-icon-demon' : ''}`}
                    />
                </div>
                <div className="level-info">
                    <div className="level-header">
                        <div className="level-title-block">
                            <h2 className="level-name">
                                <Link to={`/level/${level.levelId}`}>
                                    {level.levelName}
                                </Link>
                            </h2>
                            <span className="difficulty-value-label">{level.difficulty}</span>
                            {getTypeIcon(level.type) && (
                                <img
                                    src={getTypeIcon(level.type)}
                                    alt={level.type}
                                    className="type-icon"
                                />
                            )}
                        </div>
                    </div>
                    <a
                        href={`https://gdbrowser.com/u/${level.creatorAccountId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="level-author"
                        data-text={`by ${level.creatorUsername}`}
                    >
                        by {level.creatorUsername}
                    </a>
                </div>
                <Link
                    to={`/level/${level.levelId}`}
                    className="view-level-button"
                    style={{ position: 'static', marginLeft: 'auto' }}
                >
                    VIEW
                </Link>
            </div>
            <div className="time-left-container">
                Time Left: {formatTime(timeLeft)}
            </div>
        </div>
    );
};

export default Weekly;
