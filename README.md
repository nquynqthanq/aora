# AORA

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Introduction

**AORA** is a mobile application built with React Native using the Expo framework. It leverages Tailwind CSS for styling and Appwrite for backend services such as authentication and database.

## Features

- User Authentication
- Real-time Database
- Tailwind CSS for styling
- Cross-platform support (iOS and Android)

## Technologies

- [Expo](https://expo.dev/): A framework and platform for universal React applications.
- [React Native](https://reactnative.dev/): A framework for building native apps using React.
- [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework.
- [Appwrite](https://appwrite.io/): An open-source backend server for web, mobile, and Flutter developers.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (version 14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Appwrite server set up and running

## Installation

1. Clone the repository
    ```sh
    git clone https://github.com/nguynqthawq/MyReactNativeApp.git](https://github.com/nguynqthawq/aora-app.git
    cd aora-app
    ```

2. Install dependencies
    ```sh
    npm install
    # or
    yarn install
    ```

3. Set up environment variables
   Create a `.env` file in the root of your project and add your Appwrite credentials:
    ```plaintext
    APPWRITE_ENDPOINT=https://[HOSTNAME_OR_IP]/v1
    APPWRITE_PROJECT=[YOUR_PROJECT_ID]
    APPWRITE_API_KEY=[YOUR_API_KEY]
    ```

## Running the App

1. Start the Expo development server
    ```sh
    expo start
    ```

2. Use the Expo Go app on your iOS or Android device to scan the QR code and load the app.

## Folder Structure

    MyReactNativeApp
    ├── assets              # Asset files (images, fonts, etc.)
    ├── components          # Reusable components
    ├── navigation          # Navigation setup
    ├── screens             # Screen components
    ├── styles              # Styling files
    ├── App.js              # Entry point of the application
    ├── app.json            # Expo configuration
    ├── babel.config.js     # Babel configuration
    ├── package.json        # Project dependencies and scripts
    ├── tailwind.config.js  # Tailwind CSS configuration
    └── .env                # Environment variables

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
