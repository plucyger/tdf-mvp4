import React from 'react';
    import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
    import Homepage from './components/Homepage';
    import IntelligenceHub from './components/IntelligenceHub';
    import SocialNetworking from './components/SocialNetworking';
    import Auth from './components/Auth';
    import Notifications from './components/Notifications';
    import './App.css';

    function App() {
      const token = localStorage.getItem('token');

      return (
        <Router>
          <div className="App">
            <header className="App-header">
              <h1>International Development Hub</h1>
              <nav>
                <Link to="/">Home</Link>
                <Link to="/intelligence-hub">Intelligence Hub</Link>
                <Link to="/social-networking">Social Networking</Link>
                <Link to="/notifications">Notifications</Link>
              </nav>
            </header>
            <Routes>
              <Route path="/" element={token ? <Homepage /> : <Auth />} />
              <Route path="/intelligence-hub" element={token ? <IntelligenceHub /> : <Auth />} />
              <Route path="/social-networking" element={token ? <SocialNetworking /> : <Auth />} />
              <Route path="/notifications" element={token ? <Notifications /> : <Auth />} />
              <Route path="/" element={<Auth />} />
            </Routes>
          </div>
        </Router>
      );
    }

    export default App;
