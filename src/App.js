import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

// Placeholder components
const Home = () => (
  <div>
    <h2>Welcome to Our Learning Platform</h2>
    <img src={logo} className="App-logo" alt="logo" />
    <p>
      Edit <code>src/App.js</code> and save to reload.
    </p>
    <a
      className="App-link"
      href="https://reactjs.org"
      target="_blank"
      rel="noopener noreferrer"
    >
      Learn React
    </a>
  </div>
);

const About = () => <h2>About Us</h2>;

// Updated Courses component
const Courses = () => {
  const courseList = [
    { id: 1, name: "React Basics", description: "Learn the fundamentals of React", image: "https://via.placeholder.com/150" },
    { id: 2, name: "Advanced JavaScript", description: "Master advanced JS concepts", image: "https://via.placeholder.com/150" },
    { id: 3, name: "AWS Fundamentals", description: "Get started with Amazon Web Services", image: "https://via.placeholder.com/150" },
  ];

  return (
    <div className="courses-container">
      <h2>Our Courses</h2>
      <div className="course-list">
        {courseList.map(course => (
          <div key={course.id} className="course-card">
            <img src={course.image} alt={course.name} className="course-image" />
            <div className="course-info">
              <h3>{course.name}</h3>
              <p>{course.description}</p>
              <button className="enroll-button">Enroll Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Learning Platform</h1>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        <footer>
          <p>&copy; 2024 Learning Platform. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
