import { useState, useEffect } from 'react';
import './styles/Leaderboard.css';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [type, setType] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/v1/getLeaderboard?type=${type}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch leaderboard');
                }
                const data = await response.json();
                if (data && Array.isArray(data.leaderboard)) {
                    setUsers(data.leaderboard);
                } else if (Array.isArray(data)) {

                    setUsers(data);
                } else {
                    setUsers([]);
                }
                setError(null);
            } catch (err) {
                console.error("Error fetching leaderboard:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [type]);

    const filterTypes = [
        { id: 1, label: 'Sparks', icon: '/RL_sparkBig.png' },
        { id: 2, label: 'Planets', icon: '/RL_planetBig.png' },
        { id: 3, label: 'Creator Points', icon: '/RL_blueprintPoint01.png' },
        { id: 4, label: 'Coins', icon: '/RL_BlueCoin.png' }
    ];

    const handleFilterClick = (typeId) => {
        setType(typeId);
    };

    return (
        <div className="container">
            <h1 className="page-title">
                <img src="/RL_BlueCoin.png" alt="" className="page-title-icon" />
                Leaderboard
            </h1>
            <div className="leaderboard-container glass">
                <div className="leaderboard-filters">
                    {filterTypes.map((t) => (
                        <button
                            key={t.id}
                            className={`filter-btn glass ${type === t.id ? 'active' : ''}`}
                            onClick={() => handleFilterClick(t.id)}
                        >
                            <img src={t.icon} alt={t.label} className="filter-icon" />
                            {t.label}
                        </button>
                    ))}
                </div>

                {loading && <div className="leaderboard-loading">Loading leaderboard...</div>}
                {error && <div className="leaderboard-error">Error: {error}</div>}

                {!loading && !error && (
                    <div className="users-list">
                        {users.map((user, index) => (
                            <div key={user.accountId || index} className="user-card glass">
                                <div className="user-rank">{index + 1}</div>
                                <div className="user-info">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <a
                                            href={`https://gdbrowser.com/u/${user.accountId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="user-name"
                                        >
                                            {user.username}
                                        </a>
                                        {user.accountId === 7689052 ? (
                                            <img src="/RL_badgeOwner.png" alt="Rated Layouts Owner" className="user-badge" title="Rated Layouts Owner" />
                                        ) : (
                                            <>
                                                {user.isSupporter && (
                                                    <img src="/RL_badgeSupporter.png" alt="Layout Supporter" className="user-badge" title="Layout Supporter" />
                                                )}
                                                {user.modRole === 2 && (
                                                    <img src="/RL_badgeAdmin01.png" alt="Layout Admin" className="user-badge" title="Layout Admin" />
                                                )}
                                                {user.modRole === 1 && (
                                                    <img src="/RL_badgeMod01.png" alt="Layout Moderator" className="user-badge" title="Layout Moderator" />
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <div className="user-stats">
                                        <div className="stat-item" title="Sparks">
                                            <img src="/RL_sparkBig.png" alt="Sparks" className="stat-icon" />
                                            <span className="stat-value">{user.sparks}</span>
                                        </div>
                                        <div className="stat-item" title="Planets">
                                            <img src="/RL_planetBig.png" alt="Planets" className="stat-icon" />
                                            <span className="stat-value">{user.planets}</span>
                                        </div>
                                        <div className="stat-item" title="Creator Points">
                                            <img src="/RL_blueprintPoint01.png" alt="Creator Points" className="stat-icon" />
                                            <span className="stat-value">{user.creatorPoints}</span>
                                        </div>
                                        <div className="stat-item" title="Blue Coins">
                                            <img src="/RL_BlueCoin.png" alt="Coins" className="stat-icon" />
                                            <span className="stat-value">{user.blueCoins}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
