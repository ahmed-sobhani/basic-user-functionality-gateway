# User Management API GateWay

This project is a user microservice built using NestJS, MongoDB, and provides CRUD operations for user management and various authentication methods.


## Getting Started
### Prerequisites
Before you begin, ensure you have the following prerequisites installed:

- Node.js and npm
- MongoDB
- Docker and Docker Compose
- GitLab CI/CD Runner (for GitLab CI/CD)
### Installation
Clone the repository, Then cd the project directory
### Install dependencies:

```bash
npm install
```
Configure your environment variables. Create a .env file and set the required variables. You can use .env.example as a template.

### Start the application:

```bash
npm run start:dev
```
### Configuration
Adjust the environment variables in the .env file to match your configuration needs.
Configure MongoDB, Google, LinkedIn, OTP authentication strategies, and any other settings in the application as needed.
### Usage
You can now use the API endpoints to manage users.

### Authentication
#### Google Authentication
To enable Google Authentication:

Create a Google Developer Console project and configure OAuth credentials.
Set the GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.
LinkedIn Authentication
#### To enable LinkedIn Authentication:

Create a LinkedIn Developer application and configure OAuth credentials.
Set the LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET environment variables.
#### OTP Authentication
OTP (One-Time Password) authentication is enabled by default using the specified secret and issuer in the .env file.

### Build the Docker image:

```bash
docker build -t user-microservice .
```

### Start the application and services using Docker Compose:

```bash
docker-compose up -d
```

### Documentation
Generate API documentation using Compodoc:

```bash
npm run compodoc
```
View documentation by opening documentation/index.html in a web browser.

## Future Integrations
This project is prepared for future integrations with AWS Cognito, Kafka, and AWS Lambda Serverless. Follow the documentation of these services to integrate them into the microservice as needed.

## Contributing
Contributions are welcome! Please follow the Contributing Guidelines.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

Feel free to customize this README and the code to fit your specific project requirements. This template provides a starting point for building a user microservice with CRUD operations, authentication, NestJS, MongoDB, Docker, Docker Compose, GitLab CI/CD, and preparation for future integrations with AWS Cognito, Kafka, and AWS Lambda Serverless.
