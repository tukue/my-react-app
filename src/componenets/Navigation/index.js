import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

export const Navigation = () => {
  const location = useLocation();
  const routes = [
    { path: '/', label: 'Home' },
    { path: '/courses', label: 'Courses' },
    { path: '/about', label: 'About' }
  ];

  return (
    <header className="App-header">
      <h1>Learning Platform</h1>
      <nav className="main-nav">
        <ul>
          {routes.map(({ path, label }) => (
            <li key={path}>
              <Link
                to={path}
                className={`nav-link ${location.pathname === path ? 'active' : ''}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
