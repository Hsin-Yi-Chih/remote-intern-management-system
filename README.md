# Remote Intern Management System Overview:
This project is a **Remote Intern Management System** designed to help administrator efficiently monitor and evaluate the performance of remote interns through task tracking, feedback collection, and final reporting. The system focuses on **two main features**:  
1. **Assignment Management** – creating, viewing, updating and deleting assignments.  
2. **Feedback Management** – creating, reviewing, updating and deleting feedback for interns.

To maintain a clear and manageable scope for demonstrating full-stack CRUD operations, **this system is designed exclusively from the administrator's perspective**.  Administrator can create and manage intern accounts, assign assignments, and record feedback, but interns cannot log in or modify data.

The application was developed using **Node.js**, **Express**, **MongoDB Atlas**, and **React**. Project planning and task tracking were managed with **JIRA**, version control was handled via **GitHub** following a feature-branch workflow, and deployment was automated through **CI/CD** using **GitHub Actions** and **AWS EC2**.


## This system contain the following features:

- **User Authentication**  
  - Register, Login, Logout  
  - Update profile

- **Assignment Management**  
  - Create assignments  
  - View assignments  
  - Update assignments  
  - Delete assignments

- **Feedback Management**  
  - Create feedback  
  - View feedback  
  - Update feedback  
  - Delete feedback

## Prerequisites
Before setting up the project, ensure you have the following installed:
- Node.js [https://nodejs.org/en]
- Git [https://git-scm.com/]
- VS CODE editor [https://code.visualstudio.com/]
- MongoDB Atlas Account [https://account.mongodb.com/account/login]
- GitHub Account [https://github.com/]

## Project Setup Instructions
### 1. Clone the project
```bash
git clone https://github.com/rajuiit/sdlapps.git
```

## 2. Install dependencies
Run the following command in the root folder to install both frontend and backend dependencies:
```bash
npm run install-all 
```

## 3. Configure environment variables
- Inside the backend/ folder, create a .env file.
- Copy the contents from .env.example.
- Update the MongoDB connection string with your account credentials.

## 4. Start the project locally
Run the following command to start both the frontend and backend:
```bash
npm start
```
This will start both frontend and backend servers.

## Public URL of the Deployed Project
http://16.176.175.24/

> **Note:** This IP corresponds to the successful deployment date (Aug 13, 2025).
> The IP may change if the EC2 instance is restarted.

### Test Login Credentials
Username: chy123456@gmail.com
Password: 123456

## Jira Board URL:
https://connect-team-k67zdr7i.atlassian.net/jira/software/projects/RIMS/boards/34


## CI/CD Pipeline with GitHub Actions
This project uses GitHub Actions to automatically deploy both frontend and backend to an AWS EC2 instance.
- The workflow is triggered upon every push to the `main` branch.
- Deployment is performed via SSH using secure credentials stored in GitHub Secrets.
- The EC2 instance pulls the latest code from the repository, installs dependencies, and restarts the application using PM2.
- Both frontend and backend run on the same server and are accessible via the same public IP.
- All frontend interactions trigger backend API calls that update data stored in MongoDB Atlas in real time.

## Version Control Strategy
The project follows Git best practices:
- `main` branch for stable code
- Feature branches created and merged via pull requests
- Meaningful commit messages















