import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Daily from './Daily';
import Weekly from './Weekly';
import Monthly from './Monthly';
import Home from './Home';
import Featured from './Featured';
import Leaderboard from './Leaderboard';
import Gauntlets from './Gauntlets';
import GenericPage from './GenericPage';
import PageLayout from './components/PageLayout';
import { Analytics } from "@vercel/analytics/react";
import SentLayouts from './SentLayouts';
import Search from './Search';
import Profile from './Profile';
import Level from './Level';

function App() {
  return (
    <>
      <div className="mobile-blocker">
        <div className="mobile-blocker-content glass">
          <h1>Your screen width is too small</h1>
          <p>You unable to view this page on your device. Either rotate your device or use a larger screen.</p>
        </div>
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route element={<PageLayout />}>
            <Route path="/featured" element={<Featured />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/gauntlets" element={<Gauntlets />} />
            <Route path="/sent" element={<SentLayouts />} />
            <Route path="/search" element={<Search />} />
            <Route path="/daily" element={<Daily />} />
            <Route path="/weekly" element={<Weekly />} />
            <Route path="/monthly" element={<Monthly />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user/:accountId" element={<Profile />} />
            <Route path="/level/:levelIdOrName" element={<Level />} />
          </Route>
        </Routes>
      </Router>
      <Analytics />
    </>
  );
}

export default App;
