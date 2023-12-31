//this code will run a series of questions within the command line of a terminal.  once those questions have been answered a README.md file will be generated for the user with their unique answers

// TODO: Include packages needed for this application
const fs = require('fs');
const inquirer = require('inquirer');
const markdown = require('markdown-it')();
const https = require('https');
// TODO: Create an array of questions for user input
const questions = [
  {
    type: 'input',
    message: 'What is your projects title? This will also append to the front of your README.md file name.',
    name: 'titleInput'
  }, {
    type: 'input',
    message: 'Enter a description for your project.',
    name: 'descriptionInput'
  }, {
    type: 'input',
    message: 'What are the installation instructions for your project?',
    name: 'installInput'
  }, {
    type: 'input',
    message: 'What instructions and examples of use should be added to the usage section?',
    name: 'usageInput'
  },
  {
    type: 'input',
    message: 'If you would like others to be able to contribute to your project, what instructions would you like to include for them to do so?',
    name: 'contributeInput'
  }, {
    type: 'input',
    message: 'Have you developed test for you project? If so, enter those details here',
    name: 'testsInput'
  }, {
    type: 'list',
    message: 'What license would you like this project to have?',
    name: 'licenseInput',
    choices: [
      'MIT',
      'GPLv2',
      'Apache',
      'GPLv3',
      'Other: you will need to add these details once file is created'
    ]
  }, {
    type: 'input',
    message: 'What is your github username',
    name: 'githubInput'
  },
  {
    type: 'input',
    message: 'What is your email address',
    name: 'emailInput'
  },

];

function fetchLicenseDetails(licenseDetailsUrl) {
  return new Promise((resolve, reject) => {
    https.get(licenseDetailsUrl, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        resolve(data);
      });

      response.on('error', (error) => {
        reject(error);
      });
    });
  });
}

// Get the license text, link and svg based on the user's choice
async function getLicenseInfo(license) {
  let licenseText = '';
  let licenseLink = '';
  let licenseSVG = '';
  let licenseDetails = '';

  switch (license) {
    case 'MIT':
      licenseText = 'MIT License';
      licenseLink = 'https://opensource.org/licenses/MIT';
      licenseSVG = 'https://img.shields.io/badge/License-MIT-yellow.svg';
      licenseDetails = 'https://www.boost.org/LICENSE_1_0.txt';
      break;
    case 'GPLv2':
      licenseText = 'GNU General Public License v2.0';
      licenseLink = 'https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html';
      licenseSVG = 'https://img.shields.io/badge/License-GPL_v2-blue.svg';
      licenseDetails = 'https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt';
      break;
    case 'Apache':
      licenseText = 'Apache License 2.0';
      licenseLink = 'https://www.apache.org/licenses/LICENSE-2.0';
      licenseSVG = 'https://img.shields.io/badge/License-Apache_2.0-blue.svg';
      licenseDetails = 'https://www.apache.org/licenses/LICENSE-2.0.txt';
      break;
    case 'GPLv3':
      licenseText = 'GNU General Public License v3.0';
      licenseLink = 'https://www.gnu.org/licenses/gpl-3.0.en.html';
      licenseSVG = 'https://img.shields.io/badge/License-GPLv3-blue.svg';
      licenseDetails = 'https://www.gnu.org/licenses/gpl-3.0.txt';

      break;
    case 'Other':
      licenseText = 'Custom License (Add type of license here)';
      licenseLink = 'Custom License (Add link to license here)';
      licenseSVG = 'https://img.shields.io/badge/License-Other-red.svg';
      licenseDetails = 'Custom License (Add details here)';
      break;
    default:
      // Empty string for unsupported licenses
      licenseText = '';
      licenseLink = '';
      licenseSVG = '';
      licenseDetails = '';
  }
  
  console.log(licenseDetails);

  
    licenseDetails = await fetchLicenseDetails (licenseDetails)
    console.log({licenseText, licenseLink, licenseSVG, licenseDetails})
    return { text: licenseText, link: licenseLink, svg: licenseSVG, details: licenseDetails };

}





// Function to generate the README content based on user input
async function generateReadme(data) {
  const { text: licenseText, link: licenseLink, svg: licenseSVG, details: licenseDetails } = await getLicenseInfo(data.licenseInput);
  const tableOfContents = `
  
  
  ## Table of Contents

  <div style="display: flex;">
  <a href="#description" style="text-decoration: none; margin: 5px;">
    <img src="https://img.shields.io/badge/Description-37a779?style=for-the-badge" alt="Description" />
  </a>
  <a href="#installation" style="text-decoration: none; margin: 5px;">
    <img src="https://img.shields.io/badge/Installation-37a779?style=for-the-badge" alt="Installation" />
  </a>
  <a href="#usage" style="text-decoration: none; margin: 5px;">
    <img src="https://img.shields.io/badge/Usage-37a779?style=for-the-badge" alt="Usage" />
  </a>
  <a href="#contributing" style="text-decoration: none; margin: 5px;">
    <img src="https://img.shields.io/badge/Contributing-37a779?style=for-the-badge" alt="Contributing" />
  </a>
  <a href="#tests" style="text-decoration: none; margin: 5px;">
    <img src="https://img.shields.io/badge/Tests-37a779?style=for-the-badge" alt="Tests" />
  </a>
  <a href="#license" style="text-decoration: none; margin: 5px;">
    <img src="${licenseSVG}" alt="${licenseText}" alt="License" style="height:28px" />
  </a>
  <a href="#contact" style="text-decoration: none; margin: 5px;">
    <img src="https://img.shields.io/badge/Contact-37a779?style=for-the-badge" alt="Contact" />
  </a>
</div>`;

  const readmeContent = `
  <p id="back_to_top"></p>

# ${data.titleInput}

${tableOfContents}

## Description
${data.descriptionInput}

<p align="right">(<a href="#back_to_top">back to top</a>)</p>

## Installation
${data.installInput}

<p align="right">(<a href="#back_to_top">back to top</a>)</p>

## Usage
${data.usageInput}

<p align="right">(<a href="#back_to_top">back to top</a>)</p>

## Contributing
${data.contributeInput}

<p align="right">(<a href="#back_to_top">back to top</a>)</p>

## Tests
${data.testsInput}

<p align="right">(<a href="#back_to_top">back to top</a>)</p>

## License
${licenseText}

Copyright (c) 2023 ${data.githubInput}

${licenseDetails || 'License details not available.'}
\n
Fore more details on the [${licenseText}](${licenseLink}) please click the link!

<p align="right">(<a href="#back_to_top">back to top</a>)</p>

## Contact
You can get in touch with the creator through:\n
[My Github](https://github.com/${data.githubInput})\n
[Email the creator](mailto:${data.emailInput})\n

<p align="right">(<a href="#back_to_top">back to top</a>)</p>`;

  return readmeContent;
}

// TODO: Create a function to write README file
// Function to write README file
async function writeToFile(data) {
  const readmeContent = await generateReadme(data);
  const fileName = `${data.titleInput.toLowerCase()}README.md`;

  fs.writeFile(fileName, readmeContent, (err) => {
    if (err) {
      console.error('Error writing to file', err);
    } else {
      console.log("Written to file:", fileName);
    }
  });
}


// TODO: Create a function to initialize app
function init() {
  inquirer.prompt(questions)
    .then(writeToFile)
}

// Function call to initialize app
init();