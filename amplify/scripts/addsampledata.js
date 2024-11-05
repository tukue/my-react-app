const { Amplify } = require('aws-amplify');
const { generateClient } = require('aws-amplify/api');
const path = require('path');
const fs = require('fs');

// Attempt to find the amplifyconfiguration.json file
const possiblePaths = [
  path.resolve(__dirname, '../../src/amplifyconfiguration.json'),
  path.resolve(__dirname, '../amplifyconfiguration.json'),
  path.resolve(__dirname, '../../amplifyconfiguration.json'),
  path.resolve(__dirname, '../../../src/amplifyconfiguration.json'),
  path.resolve(__dirname, '../../../amplifyconfiguration.json')
];

let config;
let configPath;
for (const filePath of possiblePaths) {
  if (fs.existsSync(filePath)) {
    config = require(filePath);
    configPath = filePath;
    break;
  }
}

if (!config) {
  console.error('Could not find amplifyconfiguration.json. Please ensure it exists in the project.');
  console.error('Searched in the following locations:');
  possiblePaths.forEach(path => console.error(`- ${path}`));
  console.error('Please make sure you have run "amplify pull" to generate the configuration file.');
  process.exit(1);
}

console.log(`Using configuration file: ${configPath}`);

// Add the API key to the configuration
config.aws_appsync_apiKey = 'hp4w42xpunddbnufra7eqldam4'; // Replace with your actual API key

Amplify.configure(config);

const client = generateClient();

const createCourse = /* GraphQL */ `
  mutation CreateCourse(
    $input: CreateCourseInput!
  ) {
    createCourse(input: $input) {
      id
      title
      description
      instructor
      duration
      level
      image
    }
  }
`;

const sampleCourses = [
  {
    title: "Introduction to React",
    description: "Learn the basics of React",
    instructor: "John Doe",
    duration: 30,
    level: "Beginner",
    image: "https://example.com/react-course-image.jpg"
  },
  // ... other courses ...
];

async function addSampleCourses() {
  console.log('Starting to add sample courses...');

  for (const courseData of sampleCourses) {
    try {
      console.log('Attempting to create course:', courseData.title);

      const newCourse = await client.graphql({
        query: createCourse,
        variables: { input: courseData },
        authMode: 'API_KEY'
      });

      console.log('Course created successfully:', newCourse.data.createCourse.id);

      // Add a small delay to avoid potential rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error adding course ${courseData.title}:`, error);
      if (error.errors) {
        error.errors.forEach(e => console.error('GraphQL error:', e.message));
      }
    }
  }

  console.log("Finished adding sample courses");
}

addSampleCourses();
