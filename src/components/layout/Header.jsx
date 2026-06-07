import { Link, useLocation } from 'wouter';

export default function Header() {
  const [location] = useLocation();

  // Only show the header on non-landing pages.
  // The landing page has its own nav embedded inside the .rs-wrap layout.
  if (location === '/') return null;

  return (
    <nav className="rs-nav" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      <Link href="/" className="rs-logo" style={{ textDecoration: 'none' }}>
        <div className="rs-logo-dot" />
        ResumeScreen
      </Link>
      <div className="rs-nav-links">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/dashboard">
          <button className="rs-btn">Get Started</button>
        </Link>
      </div>
    </nav>
  );
}
