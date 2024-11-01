const { Amplify } = require('aws-amplify');
const { generateClient } = require('aws-amplify/api');
const { createCourse } = require('./graphql/mutations');
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

Amplify.configure(config);

const client = generateClient();

async function addSampleCourses() {
  try {
    console.log('Starting to add sample courses...');

    const courseData = {
      title: "Introduction to React",
      description: "Learn the basics of React",
      instructor: "John Doe",
      duration: 30,
      level: "Beginner",
      image: "https://example.com/react-course-image.jpg"
    };

    console.log('Attempting to create course:', courseData);

    const newCourse = await client.graphql({
      query: createCourse,
      variables: { input: courseData }
    });

    console.log('Course created successfully:', newCourse);

    // Add more courses here if needed

    console.log("Sample courses added successfully");
  } catch (error) {
    console.error("Error adding sample courses:", error);
  }
}

addSampleCourses();
