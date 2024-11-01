import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import logo from './logo.svg';
import { generateClient } from 'aws-amplify/api';
import config from './amplifyconfiguration.json';
import { Amplify } from 'aws-amplify';
import './App.css';

Amplify.configure(config);

const client = generateClient();

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
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const coursesData = await client.models.Course.list();
      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching courses", error);
    }
  }

  return (
    <div className="courses-container">
      <h2>Our Courses</h2>
      <div className="course-list">
        {courses.map(course => (
          <div key={course.id} className="course-card">
            <img src={course.image} alt={course.title} className="course-image" />
            <div className="course-info">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>Instructor: {course.instructor}</p>
              <p>Duration: {course.duration} hours</p>
              <p>Level: {course.level}</p>
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
