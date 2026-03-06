import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GDClient } from 'gavatar';
import { User, Search as SearchIcon, IdCard } from 'lucide-react';
import GDIcon from './components/GDIcon';
import LayoutBrowser from './components/LayoutBrowser';
import './styles/Profile.css';

const client = new GDClient({ endpoint: '/gd-api' });

const Profile = () => {
    const { accountId } = useParams();
    const isNumericId = accountId ? /^\d+$/.test(accountId) : false;
    const initialMethod = accountId ? (isNumericId ? 'accountId' : 'username') : 'username';
    const [searchMethod, setSearchMethod] = useState(initialMethod);
    const [searchValue, setSearchValue] = useState(accountId || '');
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [layoutsFetchUrl, setLayoutsFetchUrl] = useState(null);
    const [ratedLayoutsFetchConfig, setRatedLayoutsFetchConfig] = useState(null);
    const [ratedLayoutsCount, setRatedLayoutsCount] = useState(0);
    const [sentLayoutsCount, setSentLayoutsCount] = useState(0);
    const [avatarData, setAvatarData] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setAvatarData(null);

        const loadAvatar = async () => {
            const identifier = profileData?.accountId || profileData?.username || searchValue;
            if (!identifier) return;

            try {
                const avatar = await client.getAvatar(identifier, 'cube');
                if (isMounted) {
                    setAvatarData(avatar);
                }
            } catch (err) {
                console.error("Failed to fetch avatar:", err);
            }
        };

        loadAvatar();

        return () => { isMounted = false; };
    }, [profileData?.username, profileData?.accountId]);

    useEffect(() => {
        if (accountId) {
            const methodToUse = /^\d+$/.test(accountId) ? 'accountId' : 'username';
            handleSearch(methodToUse, accountId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountId]);

    const handleSearch = async (overrideMethod, overrideValue) => {
        const method = typeof overrideMethod === 'string' ? overrideMethod : searchMethod;
        const value = overrideValue !== undefined ? overrideValue : searchValue;

        if (!value || !value.toString().trim()) return;

        setLoading(true);
        setError(null);
        setProfileData(null);
        setLayoutsFetchUrl(null);
        setRatedLayoutsFetchConfig(null);
        setRatedLayoutsCount(0);
        setSentLayoutsCount(0);

        try {
            const queryParam = method === 'username' ? 'username' : 'accountId';
            const term = value.toString().trim();
            const response = await fetch(`/v1/getProfile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    [queryParam]: queryParam === 'accountId' ? Number(term) : term
                })
            });

            if (!response.ok) {
                // If 404, maybe just no profile found
                if (response.status === 404) {
                    throw new Error('User not found');
                }
                throw new Error('Error fetching profile');
            }

            const data = await response.json();
            setProfileData(data);

            // Set up LayoutBrowser for Sent Layouts (getSends)
            const sendsUrl = new URL('/v1/getSends', window.location.origin);
            sendsUrl.searchParams.set(queryParam, term);
            setLayoutsFetchUrl(sendsUrl.toString());

            // Set up LayoutBrowser for Rated Layouts (getLayouts)
            // Use the username from the profile response if available, as getLayouts expects username
            const usernameForLayouts = data.username || term;
            setRatedLayoutsFetchConfig({
                url: '/v1/getLayouts',
                options: {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: usernameForLayouts,
                        type: 'any',
                        // Defaults similar to Search.jsx
                        award: 0,
                        featured: 0,
                        epic: 0,
                        legendary: 0,
                        oldest: 0,
                        query: '',
                        difficulty: 0,
                        amount: 100
                    })
                }
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const toggleMethod = (method) => {
        setSearchMethod(method);
        setSearchValue(''); // Clear input on toggle to avoid confusion
    };

    return (
        <div className="container">
            <h1 className="page-title">
                User Profile
            </h1>

            <div className="glass profile-search-container">
                <div className="profile-search-header">
                    <SearchIcon size={24} />
                    Find User
                </div>

                <div className="profile-search-content">
                    <div className="profile-search-row">
                        <div className="search-toggles">
                            <button
                                className={`search-toggle-btn ${searchMethod === 'username' ? 'active' : ''}`}
                                onClick={() => toggleMethod('username')}
                            >
                                Username
                            </button>
                            <button
                                className={`search-toggle-btn ${searchMethod === 'accountId' ? 'active' : ''}`}
                                onClick={() => toggleMethod('accountId')}
                            >
                                Account ID
                            </button>
                        </div>

                        <div className="profile-search-field flex-grow">
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={searchMethod === 'username' ? 'Enter username...' : 'Enter account ID...'}
                                className="profile-input"
                                autoFocus
                            />
                        </div>

                        <button className="profile-submit-btn" onClick={handleSearch} disabled={loading}>
                            {loading ? 'LOADING...' : 'SEARCH'}
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="glass profile-error">
                    <p>{error}</p>
                </div>
            )}

            {profileData && (
                <>
                    <div className="glass profile-results">
                        <div className="profile-header">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                                {profileData.accountId === 7689052 ? (
                                    <img src="/RL_badgeOwner.png" alt="Rated Layouts Owner" className="user-badge" title="Rated Layouts Owner" />
                                ) : (
                                    <>
                                        {profileData.isSupporter && (
                                            <img src="/RL_badgeSupporter.png" alt="Layout Supporter" className="user-badge" title="Layout Supporter" />
                                        )}
                                        {profileData.isBooster && (
                                            <img src="/RL_badgeBooster.png" alt="Server Booster" className="user-badge" title="Server Booster" />
                                        )}
                                        {profileData.isClassicAdmin && (
                                            <img src="/RL_badgeAdmin01.png" alt="Classic Admin" className="user-badge" title="Classic Admin" />
                                        )}
                                        {profileData.isClassicMod && (
                                            <img src="/RL_badgeMod01.png" alt="Classic Moderator" className="user-badge" title="Classic Moderator" />
                                        )}
                                        {profileData.isPlatAdmin && (
                                            <img src="/RL_badgePlatAdmin01.png" alt="Platformer Admin" className="user-badge" title="Platformer Admin" />
                                        )}
                                        {profileData.isPlatMod && (
                                            <img src="/RL_badgePlatMod01.png" alt="Platformer Moderator" className="user-badge" title="Platformer Moderator" />
                                        )}
                                        {profileData.isLeaderboardMod && (
                                            <img src="/RL_badgelbMod01.png" alt="Leaderboard Moderator" className="user-badge" title="Leaderboard Moderator" />
                                        )}
                                    </>
                                )}
                                <h2>{profileData.username || searchValue}</h2>
                            </div>
                            {(profileData.accountId || searchMethod === 'accountId') && (
                                <span className="account-id">
                                    Account ID: {profileData.accountId || (searchMethod === 'accountId' ? searchValue : 'Unknown')}
                                </span>
                            )}
                        </div>

                        <div className="profile-stats-grid">
                            <div className="stat-card">
                                <span className="stat-label"><img src="/RL_sparkBig.png" style={{ width: '24px', height: '24px', verticalAlign: 'middle', marginRight: '0.5rem', objectFit: 'contain' }} alt="Sparks" />Sparks</span>
                                <span className="stat-value">{profileData.sparks ?? '-'}</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label"><img src="/RL_planetBig.png" style={{ width: '24px', height: '24px', verticalAlign: 'middle', marginRight: '0.5rem', objectFit: 'contain' }} alt="Planets" />Planets</span>
                                <span className="stat-value">{profileData.planets ?? '-'}</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label"><img src="/RL_BlueCoin.png" style={{ width: '24px', height: '24px', verticalAlign: 'middle', marginRight: '0.5rem', objectFit: 'contain' }} alt="Blue Coins" />Blue Coins</span>
                                <span className="stat-value">{profileData.blueCoins ?? '-'}</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label"><img src="/RL_blueprintPoint01.png" style={{ width: '24px', height: '24px', verticalAlign: 'middle', marginRight: '0.5rem', objectFit: 'contain' }} alt="Blueprint Points" />Blueprint Points</span>
                                <span className="stat-value">{profileData.creatorPoints ?? '-'}</span>
                            </div>
                        </div>
                    </div>

                    {ratedLayoutsFetchConfig && (
                        <div style={{ marginTop: '2rem', width: '100%', maxWidth: '1200px' }}>
                            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)', WebkitTextStroke: '5px black', paintOrder: 'stroke fill' }}>
                                Rated Layouts ({ratedLayoutsCount})
                            </h2>
                            <LayoutBrowser
                                key={`rated-${JSON.stringify(ratedLayoutsFetchConfig)}`}
                                fetchUrl={ratedLayoutsFetchConfig.url}
                                fetchOptions={ratedLayoutsFetchConfig.options}
                                hidePagination={true}
                                onMetaChange={(meta) => setRatedLayoutsCount(meta.totalAmount)}
                            />
                        </div>
                    )}

                    {layoutsFetchUrl && (
                        <div style={{ marginTop: '2rem', width: '100%', maxWidth: '1200px' }}>
                            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)', WebkitTextStroke: '5px black', paintOrder: 'stroke fill' }}>
                                Sent Layouts ({sentLayoutsCount})
                            </h2>
                            <LayoutBrowser
                                key={layoutsFetchUrl}
                                fetchUrl={layoutsFetchUrl}
                                hidePagination={true}
                                onMetaChange={(meta) => setSentLayoutsCount(meta.totalAmount)}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Profile;
