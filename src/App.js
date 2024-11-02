import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import logo from './logo.svg';
import { generateClient } from 'aws-amplify/api';
import config from './amplifyconfiguration.json';
import { Amplify } from 'aws-amplify';
import './App.css';

Amplify.configure(config);

const client = generateClient();

// Test courses data
const testCourses = [
  {
    id: '1',
    title: 'Introduction to React',
    description: 'Learn the basics of React',
    instructor: '',
    duration: 30,
    level: 'Beginner',
    image: 'https://via.placeholder.com/150'
  },
  {
    id: '2',
    title: 'Advanced JavaScript',
    description: 'Deep dive into JavaScript concepts',
    instructor: '',
    duration: 45,
    level: 'Advanced',
    image: 'https://via.placeholder.com/150'
  },
  {
    id: '3',
    title: 'GraphQL Fundamentals',
    description: 'Understanding GraphQL and its benefits',
    instructor: '',
    duration: 25,
    level: 'Intermediate',
    image: 'https://via.placeholder.com/150'
  }
];

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
  const [useTestData, setUseTestData] = useState(true);

  useEffect(() => {
    if (useTestData) {
      setCourses(testCourses);
    } else {
      fetchCourses();
    }
  }, [useTestData]);

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
      <button onClick={() => setUseTestData(!useTestData)}>
        {useTestData ? 'Use API Data' : 'Use Test Data'}
      </button>
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
