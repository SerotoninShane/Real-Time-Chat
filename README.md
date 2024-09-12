# Real-Time Room Manager

## Project Description
The **Real-Time Room Manager** is a live game room management system inspired by how **Jackbox Party Games** operates. It allows a host (authenticated through Google) to create a room with a unique code, which other users (guests) can join by entering the code and a username. The app supports real-time updates of players in the room, and the host has the ability to delete the room, automatically removing all participants.

The application is built using **React**, **Firebase**, and **React Router**, providing seamless real-time interactions for both hosts and guests.

## Features
- **Google Authentication for Hosts**: Hosts sign in via Google to create a room and manage participants.
- **Guest Access via Room Code**: Guests can join rooms by entering a unique room code and their username without the need for authentication.
- **Real-Time Room Updates**: As players join or leave the room, the list of participants is updated in real time.
- **Room Deletion by Host**: The host has the ability to delete the room, which automatically kicks all players and redirects them to the main room manager.
- **Player List Management**: The room keeps track of all players (both guests and the host) currently in the room.

## Installation

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [Firebase](https://firebase.google.com/)
- [npm](https://www.npmjs.com/)

### Steps to Install
1. Clone this repository:
   ```bash
   git clone https://github.com/SerotoninShane/Real-Time-Chat.git


1. Navigate to the project directory:
```cd Real-Time-Chat```
2. Install the required dependencies:
```npm install```
## Firebase Configuration
1. Set up a Firebase project on the Firebase Console.
2. Create a Firestore database and enable Google Authentication.
3. Set up your Firebase credentials by creating a .env file in the root directory of your project and adding the following:
```
    REACT_APP_FIREBASE_API_KEY=your_api_key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
    REACT_APP_FIREBASE_PROJECT_ID=your_project_id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Running the Application
1. Start the development server:
```npm start```
2. Open your browser and navigate to http://localhost:3000.

## Folder Structure
The key files and their roles in the project:

- `src/components`: Contains React components for the user interface and room management.
- `src/firebase-config.js`: Firebase configuration and initialization.
- `src/hooks`: Custom hooks for handling real-time data, such as room listeners and player management.

## Key Functionalities

### Handling Room Creation & Joining
- A host signs in via Google and creates a room with a unique code. This code is shared with guests, who can enter the room by providing the code and a username.

### Managing Players in Real Time
- The `useRoomListeners` hook listens for real-time updates to the player list in Firestore, ensuring the UI reflects current participants.

### Deleting Rooms
- The host has the ability to delete the room. Upon deletion, all participants are automatically removed and redirected to the main room manager.

## Contributing
Feel free to fork the repository and submit pull requests for improvements or additional features.

## License
This project is licensed under the MIT License.