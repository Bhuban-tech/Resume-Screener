import { Route, Switch } from 'wouter';
import Header from './components/layout/Header.jsx';
import LandingPage from './pages/LandingPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ResultsPage from './pages/ResultsPage.jsx';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink)', color: 'var(--text)', fontFamily: "'DM Sans', sans-serif" }}>
      <Header />
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/results/:resumeId" component={ResultsPage} />
        <Route>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
            <p style={{ fontSize: 64, fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>404</p>
            <p style={{ color: 'var(--muted)' }}>Page not found</p>
            <a href="/" style={{ color: 'var(--accent)', fontSize: 14 }}>Go home</a>
          </div>
        </Route>
      </Switch>
    </div>
  );
}
