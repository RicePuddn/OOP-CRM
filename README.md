# Timperio CRM System

This CRM System was built for the module "IS442 - Object Oriented Programming" by Team 2.<br>
Our memembers consists of

- [Bjorn - Importing data and Performance Metrics](https://www.linkedin.com/in/bjorn-tin-kar-g/)
- Celeste - Customer Segmentation
- [Ernest - Customer and Product Analysis](https://www.linkedin.com/in/ernest-heng-2b0aa0168/)
- Lynn - User Management
- Sue - Newsletter Template

## Prerequisites

- Java 11 or higher
- Maven
- Node.js
- MySQL Server

## Frontend

This project contains the frontend code under the folder `olive-crm` it uses the T3 stack utilizing Nextjs, TailwindCSS, Typescript.<br>To run the frontend please follow this set of instructions:<br>

```
# Change the directory to olive-crm
cd olive-crm

# Install all necessary node packages
npm i

# Start up the application
npm run dev
```

The application will start locally. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Backend

This project also contains the code for the backend under the folder `Backend` it uses Maven Spring Boot.<br>To run the backend please follow this set of instructions:
<br>To run the backend concurrently, please open a separate terminal and follow the same set of instructions:

```
# Change the directory to Backend
cd Backend

# Build the backend
mvn clean install

# Start the backend
mvn spring-boot:run
```

The application will start and be available at `http://localhost:8080`.

## Creation of Admin Account
