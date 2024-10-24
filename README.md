# Harcmistrz Web Application

**Harcmistrz** is a web application developed to support scouting activities in the field, using a REST architecture. The project consists of two main components: a **React** frontend and a **Spring Boot** backend.

## Project Structure

The repository contains two main folders:

- **Harcmistrz-React**: The frontend of the application built with React and TypeScript.
- **Harcmistrz-Spring**: The backend of the application built with Spring Boot, providing RESTful APIs.

### Folder Overview

- **Harcmistrz-React**: Handles the user interface and communication with the backend via API requests. It includes:
  - User registration and login system
  - QR code scanning for field games
  - Notifications for events and team activities
  - Management of user roles (scout, team leader, parent, etc.)

- **Harcmistrz-Spring**: Provides the business logic and database management, with features including:
  - JWT-based user authentication and authorization
  - REST APIs for managing users, teams, events, and field games
  - Integration with MongoDB for messaging and PostgreSQL for other data
  - QR code management for tracking points in field games

## Features

- **User Management**: Users can register and log in with roles such as scout, parent, team leader, or admin.
- **Event Management**: Scouts can join events, and team leaders can create and manage events.
- **Field Games**: Team leaders generate QR codes, place them in the field, and scouts scan them to receive points.
- **Messaging**: Users can send and receive messages within the app.
- **Notifications**: The system sends notifications to scouts, team leaders, and parents about upcoming events or team updates.

## Installation and Setup

### Backend (Harcmistrz-Spring)

1. Clone the repository and navigate to the `Harcmistrz-Spring` folder:
    ```bash
    cd Harcmistrz-Spring
    ```

2. Ensure you have **Java 17** and **Maven** installed on your machine.

3. Install the dependencies:
    ```bash
    mvn install
    ```

4. Run the application:
    ```bash
    mvn spring-boot:run
    ```

5. The backend will be available at `http://localhost:8080`.

### Frontend (Harcmistrz-React)

1. Navigate to the `Harcmistrz-React` folder:
    ```bash
    cd Harcmistrz-React
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

4. The frontend will be available at `http://localhost:5173`.

## Technologies Used

### Backend

- **Spring Boot** for REST API development
- **PostgreSQL** for data storage
- **JWT (JSON Web Token)** for authentication

### Frontend

- **React** with TypeScript for building the user interface
- **React Router** for navigation

## Future Development

- Integration of email notifications
- Additional reporting and analytics features for team leaders
- Improved messaging capabilities with real-time updates

## Contributions

Contributions to the Harcmistrz project are welcome! Feel free to open issues or submit pull requests with new ideas and improvements.

## License

This project is licensed under the IDGAF License.
