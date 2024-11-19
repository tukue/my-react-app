import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import logo from './logo.svg';
import { generateClient } from 'aws-amplify/api';
import config from './amplifyconfiguration.json';
import { Amplify } from 'aws-amplify';
import './App.css';

// Configure Amplify
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

// Debug utility
const debugAPI = async () => {
  try {
    console.log('Testing API connection...');
    const response = await client.models.Course.list();
    console.log('API Response:', response);
    return response;
  } catch (error) {
    console.error('API Test Failed:', error);
    throw error;
  }
};

// Data validation utility
const validateCourseData = (course) => {
  const requiredFields = {
    id: 'string',
    title: 'string',
    description: 'string',
    duration: 'number',
    level: 'string',
    image: 'string',
    instructor: 'string'
  };

  const missingFields = [];
  const invalidTypes = [];

  Object.entries(requiredFields).forEach(([field, expectedType]) => {
    if (!(field in course)) {
      missingFields.push(field);
    } else if (typeof course[field] !== expectedType) {
      invalidTypes.push(`${field}: expected ${expectedType}, got ${typeof course[field]}`);
    }
  });

  return {
    isValid: missingFields.length === 0 && invalidTypes.length === 0,
    missingFields,
    invalidTypes
  };
};

// Home Component
const Home = () => (
  <div className="home-container">
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

// About Component
const About = () => (
  <div className="about-container">
    <h2>About Us</h2>
    <p>We are dedicated to providing quality education through our online learning platform.</p>
  </div>
);

// Course Debug Info Component
const CourseDebugInfo = ({ course }) => {
  const validation = validateCourseData(course);
  
  return (
    <div style={{ 
      display: process.env.NODE_ENV === 'development' ? 'block' : 'none',
      fontSize: '12px',
      padding: '10px',
      background: '#f5f5f5',
      marginTop: '10px'
    }}>
      <h4>Debug Info</h4>
      <pre>{JSON.stringify(course, null, 2)}</pre>
      {!validation.isValid && (
        <div style={{ color: 'red' }}>
          {validation.missingFields.length > 0 && (
            <p>Missing fields: {validation.missingFields.join(', ')}</p>
          )}
          {validation.invalidTypes.length > 0 && (
            <p>Invalid types: {validation.invalidTypes.join(', ')}</p>
          )}
        </div>
      )}
    </div>
  );
};

// Courses Component
const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [useTestData, setUseTestData] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching courses...');
      const response = await client.models.Course.list();
      console.log('Raw API Response:', response);

      if (!response || response.length === 0) {
        throw new Error('No courses found');
      }

      const formattedCourses = response.map((course, index) => {
        const validation = validateCourseData(course);
        if (!validation.isValid) {
          console.warn(`Validation issues with course ${index}:`, validation);
        }

        return {
          id: course.id || `temp-${index}`,
          title: course.title || 'Untitled Course',
          description: course.description || 'No description available',
          instructor: course.instructor || 'No instructor assigned',
          duration: typeof course.duration === 'number' ? course.duration : 0,
          level: course.level || 'Not specified',
          image: course.image || 'https://via.placeholder.com/150'
        };
      });

      setCourses(formattedCourses);
    } catch (error) {
      console.error("Detailed error information:", {
        message: error.message,
        name: error.name,
        code: error.code,
        stack: error.stack
      });
      setError(`Failed to fetch courses: ${error.message}`);
      if (useTestData) {
        setCourses(testCourses);
      }
    } finally {
      setLoading(false);
    }
  }, [useTestData]);

  useEffect(() => {
    if (useTestData) {
      setCourses(testCourses);
    } else {
      fetchCourses();
    }
  }, [useTestData, fetchCourses]);

  const retryFetch = useCallback(() => {
    setUseTestData(false);
    fetchCourses();
  }, [fetchCourses]);

  if (loading) {
    return <div className="loading">Loading courses...</div>;
  }

  return (
    <div className="courses-container">
      <h2>Our Courses</h2>
      <div className="controls">
        <button onClick={() => setUseTestData(!useTestData)}>
          {useTestData ? 'Use API Data' : 'Use Test Data'}
        </button>
        {process.env.NODE_ENV === 'development' && (
          <button onClick={() => debugAPI()}>Test API Connection</button>
        )}
        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={retryFetch}>Retry</button>
          </div>
        )}
      </div>
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
              {process.env.NODE_ENV === 'development' && (
                <CourseDebugInfo course={course} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main App Component
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
          <p>&copy; {new Date().getFullYear()} Learning Platform. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
