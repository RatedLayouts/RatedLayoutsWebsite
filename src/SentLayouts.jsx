import { useState } from 'react';
import LayoutBrowser from './components/LayoutBrowser';
import './styles/SentLayouts.css';

function SentLayouts() {
    const [username, setUsername] = useState('');
    const [accountId, setAccountId] = useState('');
    const [fetchUrl, setFetchUrl] = useState('/v1/getSends');

    const handleSearch = () => {
        const url = new URL('/v1/getSends', window.location.origin);
        if (username.trim()) {
            url.searchParams.set('username', username.trim());
        }
        if (accountId.trim()) {
            url.searchParams.set('accountId', accountId.trim());
        }
        setFetchUrl(url.toString());
    };

    return (
        <div className="container">
            <h1 className="page-title">
                <img src="/RL_badgeMod01.png" alt="" className="page-title-icon" />
                Sent Layouts
            </h1>

            <div className="glass sent-search-container">
                <div className="sent-inputs-row">
                    <div className="sent-input-group">
                        <label className="sent-input-label">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="sent-input-field"
                        />
                    </div>
                </div>
                <button
                    onClick={handleSearch}
                    className="sent-search-button"
                >
                    SEARCH
                </button>
            </div>

            <LayoutBrowser fetchUrl={fetchUrl} />
        </div>
    );
}

export default SentLayouts;
