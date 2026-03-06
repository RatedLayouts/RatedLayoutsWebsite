import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './styles/Leaderboard.css';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [type, setType] = useState(1);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ total: 0, page: 1, amount: 100 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/v1/getLeaderboard?type=${type}&page=${page}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch leaderboard');
                }
                const data = await response.json();
                if (data && Array.isArray(data.leaderboard)) {
                    setUsers(data.leaderboard);
                    setMeta({
                        total: data.total || 0,
                        page: data.page || 1,
                        amount: data.amount || 100
                    });
                } else if (Array.isArray(data)) {
                    // Fallback for non-paginated response if any
                    setUsers(data);
                    setMeta({ total: data.length, page: 1, amount: data.length });
                } else {
                    setUsers([]);
                    setMeta({ total: 0, page: 1, amount: 100 });
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
    }, [type, page]);

    const handlePrevPage = () => {
        if (page > 1) setPage(p => p - 1);
    };

    const handleNextPage = () => {
        const maxPage = Math.ceil(meta.total / meta.amount);
        if (page < maxPage) setPage(p => p + 1);
    };

    const firstItem = (meta.page - 1) * meta.amount + 1;
    const lastItem = Math.min((meta.page - 1) * meta.amount + users.length, meta.total);
    const displayFirst = users.length > 0 ? firstItem : 0;
    const displayLast = users.length > 0 ? lastItem : 0;

    const filterTypes = [
        { id: 1, label: 'Sparks', icon: '/RL_sparkBig.png' },
        { id: 2, label: 'Planets', icon: '/RL_planetBig.png' },
        { id: 3, label: 'Blueprint Points', icon: '/RL_blueprintPoint01.png' },
        { id: 4, label: 'Coins', icon: '/RL_BlueCoin.png' }
    ];

    const handleFilterClick = (typeId) => {
        setType(typeId);
        setPage(1); // Reset to page 1 when filter changes
    };

    return (
        <div className="container">
            <h1 className="page-title">
                <img src="/RL_BlueCoin.png" alt="" className="page-title-icon" />
                Leaderboard
            </h1>

            <div className="page-counter glass">
                <span className="page-text">
                    {displayFirst} to {displayLast} of {meta.total}
                </span>
            </div>

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
                        {users.map((user, index) => {
                            const rank = user.rank || ((page - 1) * meta.amount + index + 1);
                            return (
                                <div key={user.accountId || index} className="user-card">
                                    <div className={`user-rank rank-${rank}`}>{rank}</div>
                                    <div className="user-info">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <Link
                                                to={`/user/${user.accountId}`}
                                                className="user-name"
                                            >
                                                {user.username}
                                            </Link>
                                            {user.accountId === 7689052 ? (
                                                <img src="/RL_badgeOwner.png" alt="Rated Layouts Owner" className="user-badge" title="Rated Layouts Owner" />
                                            ) : (
                                                <>
                                                    {user.isSupporter && (
                                                        <img src="/RL_badgeSupporter.png" alt="Layout Supporter" className="user-badge" title="Layout Supporter" />
                                                    )}
                                                    {user.isBooster && (
                                                        <img src="/RL_badgeBooster.png" alt="Server Booster" className="user-badge" title="Server Booster" />
                                                    )}
                                                    {user.isClassicAdmin && (
                                                        <img src="/RL_badgeAdmin01.png" alt="Classic Admin" className="user-badge" title="Classic Admin" />
                                                    )}
                                                    {user.isClassicMod && (
                                                        <img src="/RL_badgeMod01.png" alt="Classic Moderator" className="user-badge" title="Classic Moderator" />
                                                    )}
                                                    {user.isPlatAdmin && (
                                                        <img src="/RL_badgePlatAdmin01.png" alt="Platformer Admin" className="user-badge" title="Platformer Admin" />
                                                    )}
                                                    {user.isPlatMod && (
                                                        <img src="/RL_badgePlatMod01.png" alt="Platformer Moderator" className="user-badge" title="Platformer Moderator" />
                                                    )}
                                                    {user.isLeaderboardMod && (
                                                        <img src="/RL_badgelbMod01.png" alt="Leaderboard Moderator" className="user-badge" title="Leaderboard Moderator" />
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
                                            <div className="stat-item" title="Blueprint Points">
                                                <img src="/RL_blueprintPoint01.png" alt="Blueprint Points" className="stat-icon" />
                                                <span className="stat-value">{user.creatorPoints}</span>
                                            </div>
                                            <div className="stat-item" title="Blue Coins">
                                                <img src="/RL_BlueCoin.png" alt="Coins" className="stat-icon" />
                                                <span className="stat-value">{user.blueCoins}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="pagination-bottom">
                <button
                    onClick={handlePrevPage}
                    disabled={page <= 1}
                    className="nav-btn-glass glass"
                >
                    <ChevronLeft size={32} />
                </button>

                <button
                    onClick={handleNextPage}
                    disabled={page >= Math.ceil(meta.total / meta.amount)}
                    className="nav-btn-glass glass"
                >
                    <ChevronRight size={32} />
                </button>
            </div>
        </div>
    );
};

export default Leaderboard;
