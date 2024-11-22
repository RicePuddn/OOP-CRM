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
Currently, admin accounts cannot be created through the application interface, either in the frontend or backend, due to the restriction that admins cannot create another admin. To create an admin account, you need to manually insert the admin details directly into the MySQL database. Below is the SQL query to insert a new admin into the employees table.

### SQL Query to Create an Admin Account:
Make sure you have access to your MySQL database and use the following query to add an admin:<br>
```
-- Insert a new admin employee into the employees table
INSERT INTO employees (username, first_name, last_name, password, role, last_login, status)
VALUES ('ironman', 'Tony', 'Stark', '$2a$10$W0YqBx7I7ehmXlyMayqR.uMO14iy/0hKFXHayv0lv7hnOWs3dkn9m', 'ADMIN', NEVER, 'ACTIVE');

-- Verify the newly added employee
SELECT * FROM employees;
```

### How to Login as Admin
Use the following username and password to login as an admin:<br>
Username: ironman<br>
Password: iamgenius<br>
Notes: The example password provided here is hashed using bcrypt. Make sure to use the password 'iamgenius', which corresponds to the hash value given in the example when you login.
