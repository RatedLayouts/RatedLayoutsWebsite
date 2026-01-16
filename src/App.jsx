import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Featured from './Featured';
import Leaderboard from './Leaderboard';
import Gauntlets from './Gauntlets';
import GenericPage from './GenericPage';
import PageLayout from './components/PageLayout';
import { Analytics } from "@vercel/analytics/next"

function App() {
  return (
    <>
      <div className="mobile-blocker">
        <div className="mobile-blocker-content glass">
          <h1>Screen Too Small</h1>
          <p>Your screen is not wide enough to view this website.</p>
        </div>
      </div>
      <Analytics />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route element={<PageLayout />}>
            <Route path="/featured" element={<Featured />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/gauntlets" element={<Gauntlets />} />
            <Route path="/sent" element={<GenericPage title="Sent Layouts" />} />
            <Route path="/search" element={<GenericPage title="Search" />} />
            <Route path="/daily" element={<GenericPage title="Daily Layout" />} />
            <Route path="/weekly" element={<GenericPage title="Weekly Layout" />} />
            <Route path="/monthly" element={<GenericPage title="Monthly Layout" />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
