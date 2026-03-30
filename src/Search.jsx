import { useState } from 'react';
import { ChevronDown, ChevronUp, Search as SearchIcon } from 'lucide-react';
import LayoutBrowser from './components/LayoutBrowser';
import './styles/Search.css';

const Search = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [fetchConfig, setFetchConfig] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        type: 'any',
        award: false,
        featured: false,
        epic: false,
        legendary: false,
        oldest: false,
        username: '',
        query: '',
        difficulty: []
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'select-multiple') {
            const values = Array.from(e.target.selectedOptions, option => option.value);
            setFormData(prev => ({ ...prev, [name]: values }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSearch = () => {
        // Convert boolean/checkbox states to API expected integers (1 or 0)
        const requestBody = {
            award: formData.award ? 1 : 0,
            featured: formData.featured ? 1 : 0,
            epic: formData.epic ? 1 : 0,
            legendary: formData.legendary ? 1 : 0,
            oldest: formData.oldest ? 1 : 0,
            username: formData.username,
            query: formData.query
        };

        if (formData.type !== 'any') {
            requestBody.type = formData.type;
        }

        if (formData.difficulty && formData.difficulty.length > 0) {
            const selectedVals = formData.difficulty.filter(val => val !== "0");
            if (selectedVals.length > 0) {
                const diffArray = selectedVals
                    .flatMap(val => String(val).split(','))
                    .map(val => parseInt(val, 10))
                    .filter(val => !isNaN(val));

                if (diffArray.length > 0) {
                    requestBody.difficulty = diffArray;
                }
            }
        }

        setFetchConfig({
            url: '/v1/getLayouts',
            options: {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            }
        });

        // Optional: auto-close search card on search
        // setIsOpen(false);
    };

    return (
        <div className="container">
            <h1 className="page-title">
                Search Layouts
            </h1>

            <div className="glass search-filters-container">
                <div className="search-filters-header" onClick={() => setIsOpen(!isOpen)}>
                    <div className="search-filters-title">
                        <SearchIcon size={24} />
                        Search Filters
                    </div>
                    {isOpen ? <ChevronUp size={24} color="white" /> : <ChevronDown size={24} color="white" />}
                </div>

                <div className={`search-filters-collapsible ${isOpen ? 'open' : ''}`}>
                    <div className="search-filters-content">
                        <div className="search-filters-inner">
                            {/* Row 1: Query, Username, Type */}
                            <div className="search-row">
                                <div className="search-field">
                                    <label className="search-label">Keywords</label>
                                    <input
                                        type="text"
                                        name="query"
                                        value={formData.query}
                                        onChange={handleInputChange}
                                        placeholder="Level Name or ID..."
                                        className="search-input"
                                    />
                                </div>
                                <div className="search-field">
                                    <label className="search-label">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        placeholder="Creator..."
                                        className="search-input"
                                    />
                                </div>
                                <div className="search-field">
                                    <label className="search-label">Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="search-select"
                                    >
                                        <option value="any">Any</option>
                                        <option value="classic">Classic</option>
                                        <option value="platformer">Platformer</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row 2: Difficulty, Checkboxes */}
                            <div className="search-row" style={{ alignItems: 'center' }}>
                                <div className="search-field" style={{ maxWidth: '400px' }}>
                                    <label className="search-label">Difficulty</label>
                                    <select
                                        multiple
                                        name="difficulty"
                                        value={formData.difficulty}
                                        onChange={handleInputChange}
                                        className="search-select"
                                        style={{ height: '200px' }}
                                    >
                                        <option value="0">Any</option>
                                        <option value="1">Auto</option>
                                        <option value="2">Easy</option>
                                        <option value="3">Normal</option>
                                        <option value="4,5">Hard</option>
                                        <option value="6,7">Harder</option>
                                        <option value="8,9">Insane</option>
                                        <option value="10">Easy Demon</option>
                                        <option value="15">Medium Demon</option>
                                        <option value="20">Hard Demon</option>
                                        <option value="25">Insane Demon</option>
                                        <option value="30">Extreme Demon</option>
                                    </select>
                                </div>

                                <div className="checkbox-group" style={{ flex: 1, justifyContent: 'space-around' }}>
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="award"
                                            checked={formData.award}
                                            onChange={handleInputChange}
                                            className="checkbox-input"
                                        />
                                        Rated
                                    </label>
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="featured"
                                            checked={formData.featured}
                                            onChange={handleInputChange}
                                            className="checkbox-input"
                                        />
                                        Featured
                                    </label>
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="epic"
                                            checked={formData.epic}
                                            onChange={handleInputChange}
                                            className="checkbox-input"
                                        />
                                        Epic
                                    </label>
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="legendary"
                                            checked={formData.legendary}
                                            onChange={handleInputChange}
                                            className="checkbox-input"
                                        />
                                        Legendary
                                    </label>
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="oldest"
                                            checked={formData.oldest}
                                            onChange={handleInputChange}
                                            className="checkbox-input"
                                        />
                                        Oldest First
                                    </label>
                                </div>
                            </div>

                            <button className="search-submit-btn" onClick={handleSearch}>
                                SEARCH
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {fetchConfig && (
                <LayoutBrowser
                    key={JSON.stringify(fetchConfig)}
                    fetchUrl={fetchConfig.url}
                    fetchOptions={fetchConfig.options}
                />
            )}
        </div>
    );
};

export default Search;
