# Olive CRM Backend

This is the backend for the Olive CRM application, built with Spring Boot.

## Prerequisites

- Java 11 or higher
- Maven

## Getting Started

1. Clone the repository
2. Navigate to the Backend folder
3. Run the following command to build the project:

   ```
   mvn clean install
   ```

4. To start the application, run:

   ```
   mvn spring-boot:run
   ```

The application will start and be available at `http://localhost:8080`.

## API Endpoints

- GET `/`: Returns a welcome message

## Configuration

The `application.properties` file in `src/main/resources` contains the application configuration. Modify this file to change server port, database settings, etc.

## Development

This project uses Spring Boot 2.5.5. The main application class is `com.olivecrm.Application`.

To add new controllers, create them in the `com.olivecrm.controller` package.

## Testing

Run the following command to execute the tests:

```
mvn test
```