import { useNavigate } from 'react-router-dom';
import './styles/Home.css';

function Home() {
  const navigate = useNavigate();

  const buttons = [
    { id: 'featured', img: '/RL_featured01.png', path: '/featured', alt: 'Featured Layouts' },
    { id: 'leaderboard', img: '/RL_leaderboard01.png', path: '/leaderboard', alt: 'Leaderboard' },
    { id: 'gauntlets', img: '/RL_gauntlets01.png', path: '/gauntlets', alt: 'Layout Gauntlets' },
    { id: 'sent', img: '/RL_sent01.png', path: '/sent', alt: 'Sent Layouts' },
    { id: 'search', img: '/RL_search01.png', path: '/search', alt: 'Search' },
    { id: 'daily', img: '/RL_daily01.png', path: '/daily', alt: 'Daily Layout' },
    { id: 'weekly', img: '/RL_weekly01.png', path: '/weekly', alt: 'Weekly Layout' },
    { id: 'monthly', img: '/RL_monthly01.png', path: '/monthly', alt: 'Monthly Layout' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="container">
      <div className="intro-card glass">
        <a
          href="https://geode-sdk.org/mods/arcticwoof.rated_layouts"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/RL_title.png" alt="Rated Layouts" className="title-image" />
        </a>
        <div className="button-grid">
          {buttons.map((btn) => (
            <button
              key={btn.id}
              className="menu-button"
              onClick={() => handleNavigation(btn.path)}
            >
              <img src={btn.img} alt={btn.alt} />
            </button>
          ))}
        </div>
        <div className="credits-text">
          <p>💝 Geode Mod and Website created by <b>ArcticWoof</b></p>
          <p>💫 Rated Layouts Assets created by <b>Dasshu & Darkore</b></p>
          <p>🧊 Original Assets and Images by <b>RobTop Games</b></p>
        </div>
      </div>
    </div>
  );
}

export default Home;
