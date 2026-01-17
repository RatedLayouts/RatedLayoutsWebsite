import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/LayoutBrowser.css';

const LayoutBrowser = ({ fetchUrl, layouts, fetchOptions = {}, hidePagination = false }) => {
  const [levels, setLevels] = useState([]);
  const [meta, setMeta] = useState({ totalAmount: 0, page: 1, amount: 10 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (layouts) {
      setLevels(layouts);
      setMeta({
        totalAmount: layouts.length,
        page: 1,
        amount: layouts.length
      });
      setLoading(false);
      return;
    }

    const fetchLevels = async () => {
      try {
        setLoading(true);

        const urlStr = fetchUrl.startsWith('http') ? fetchUrl : `${window.location.origin}${fetchUrl}`;
        const url = new URL(urlStr);
        url.searchParams.set('page', page);

        const response = await fetch(url.toString(), fetchOptions);
        if (!response.ok) {
          throw new Error('Failed to fetch levels');
        }
        const data = await response.json();
        // The API returns { layouts: [...], totalAmount, page, amount }
        if (data && data.layouts) {
          setLevels(data.layouts);
          setMeta({
            totalAmount: data.totalAmount || 0,
            page: data.page || 1,
            amount: data.amount || 10
          });
        } else {
          setLevels([]);
          setMeta({ totalAmount: 0, page: 1, amount: 10 });
        }
      } catch (err) {
        console.error("Error fetching levels:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (fetchUrl) {
      if (fetchOptions.method === 'POST' && fetchOptions.body) {
        // If POST with body, we need to make sure the effect only triggers when body actually changes
        // Use JSON stringify to compare dependencies or assume parent handles stability
        fetchLevels();
      } else {
        fetchLevels();
      }
    }
    // To properly support POST body updates, we should include fetchOptions in dependencies,
    // but deep object comparison in deps is tricky.
    // Relying on `fetchUrl` changing or `page` changing.
    // However, for search, fetchOptions (body) changes when user searches.
    // We can assume parent changes `fetchUrl` or we verify `fetchOptions` stability.
    // A simpler way: stringify fetchOptions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchUrl, page, layouts, JSON.stringify(fetchOptions)]);

  const handlePrevPage = () => {
    if (page > 1) setPage(p => p - 1);
  };

  const handleNextPage = () => {
    const maxPage = Math.ceil(meta.totalAmount / meta.amount);
    if (page < maxPage) setPage(p => p + 1);
  };

  const firstItem = (meta.page - 1) * meta.amount + 1;
  const lastItem = Math.min((meta.page - 1) * meta.amount + levels.length, meta.totalAmount);
  // Guard against case where firstItem > lastItem (e.g. empty results)
  const displayFirst = levels.length > 0 ? firstItem : 0;
  const displayLast = levels.length > 0 ? lastItem : 0;

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
    return null;
  };

  const getTypeIcon = (type) => {
    if (type === "classic") return '/RL_sparkMed.png';
    if (type === "platformer") return '/RL_planetMed.png';
    return null;
  };

  if (loading && levels.length === 0) return <div className="layout-browser-loading glass">Loading levels...</div>;
  if (error) return <div className="layout-browser-error glass">Error: {error}</div>;

  return (
    <>
      {!hidePagination && (
        <div className="page-counter glass">
          <span className="page-text">
            {displayFirst} to {displayLast} of {meta.totalAmount}
          </span>
        </div>
      )}
      <div className="layout-browser-container glass">
        {loading && <div className="layout-browser-overlay glass">Loading...</div>}
        {levels.length === 0 ? (
          <div className="no-layouts-found">
            No Layouts Found
          </div>
        ) : (
          levels.map((level) => {
            let difficulty = level.difficulty;
            if (!difficulty && level.averageDifficulty) {
              const avg = Math.round(level.averageDifficulty);
              difficulty = avg >= 10 ? Math.round(level.averageDifficulty / 5) * 5 : avg;
            }
            difficulty = difficulty || 0;
            const score = level.featuredScore !== undefined ? level.featuredScore : level.totalSuggests;
            const scoreLabel = level.featuredScore !== undefined ? "Featured Score" : "Total Suggests";
            const levelName = level.levelName || `Level ID: ${level.levelId}`;
            const isDemonValue = isDemon(difficulty);

            return (
              <div key={level.levelId} className="level-card glass">
                {level.featuredScore !== undefined && (
                  <span className="featured-score">Featured Score: {level.featuredScore}</span>
                )}
                <div className="level-difficulty-container">
                  {getFeaturedCoin(level.featured) && (
                    <img
                      src={getFeaturedCoin(level.featured)}
                      alt="Featured Coin"
                      className={`featured-coin-bg ${level.featured === 2 ? 'epic-coin' : ''}`}
                    />
                  )}
                  <img
                    src={getDifficultyAsset(difficulty)}
                    alt={`Difficulty ${difficulty}`}
                    className={`difficulty-icon ${isDemonValue ? 'difficulty-icon-demon' : ''}`}
                  />
                </div>
                <div className="level-info">
                  <div className="level-header">
                    <div className="level-title-block">
                      <h2 className="level-name">
                        <a
                          href={`https://gdbrowser.com/${level.levelId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {levelName}
                        </a>
                      </h2>
                      <span className="difficulty-value-label">
                        {level.featuredScore === undefined ? "Avg Diff: " : ""}
                        {difficulty}
                      </span>
                      {getTypeIcon(level.type) && (
                        <img
                          src={getTypeIcon(level.type)}
                          alt={level.type}
                          className="type-icon"
                        />
                      )}
                    </div>
                  </div>
                  {level.totalSuggests !== undefined && (
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#fff', marginTop: '0.2rem', marginBottom: '0.2rem', fontFamily: 'Helvetica, sans-serif', fontWeight: 'bold' }}>
                      <span>Total Suggests: {level.totalSuggests}</span>
                      {level.suggestedFeatured > 0 && <span>Featured: {level.suggestedFeatured}</span>}
                      {level.suggestedEpic > 0 && <span>Epic: {level.suggestedEpic}</span>}
                    </div>
                  )}
                  {level.creatorUsername && (
                    <a
                      href={`https://gdbrowser.com/u/${level.creatorAccountId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="level-author"
                      data-text={`by ${level.creatorUsername}`}
                    >
                      by {level.creatorUsername}
                    </a>
                  )}
                </div>
                <a
                  href={`https://gdbrowser.com/${level.levelId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-level-button"
                >
                  VIEW
                </a>
              </div>
            )
          }))}
      </div>

      {!hidePagination && (
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
            disabled={page >= Math.ceil(meta.totalAmount / meta.amount)}
            className="nav-btn-glass glass"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </>
  );

  function getFeaturedCoin(featured) {
    if (featured === 1) return '/RL_featuredCoin.png';
    if (featured === 2) return '/RL_epicFeaturedCoin.png';
    return null;
  }

  function isDemon(diff) {
    return [10, 15, 20, 25, 30].includes(diff);
  }
};

export default LayoutBrowser;
