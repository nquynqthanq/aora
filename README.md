<div align="center">
  <br />
      <img src="https://i.postimg.cc/5NR9bxFM/Sora-README.png" alt="Project Banner">
    </a>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-React_Native-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="react.js" />
    <img src="https://img.shields.io/badge/-Appwrite-black?style=for-the-badge&logoColor=white&logo=appwrite&color=FD366E" alt="appwrite" />
    <img src="https://img.shields.io/badge/NativeWind-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="nativewind" />
  </div>
    <h1>AORA</h1>
</div>

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


👉 **Onboarding Screen**: Engaging graphics and clear instructions welcome users to the app.

👉 **Robust Authentication & Authorization System**: Secure email login safeguards user accounts.

👉 **Dynamic Home Screen with Animated Flat List**: Smoothly animated flat list showcases the latest videos for seamless browsing.

👉 **Pull-to-Refresh Functionality**: Users can refresh content with a simple pull gesture for up-to-date information.

👉 **Full-Text Search Capability**: Efficiently search through videos with real-time suggestions and instant results.

👉 **Tab Navigation**: Navigate between sections like Home, Search, and Profile with ease using tab navigation.

👉 **Post Creation Screen for Uploading Media**: Upload video and image posts directly from the app with integrated media selection.

👉 **Profile Screen with Detailed Insights**: View account details and activity, including uploaded videos and follower count, for a personalized experience.

👉 **Responsiveness**: Smooth performance and adaptability across various devices and screen sizes for a consistent user experience.

👉 **Animations**: Dynamic animations using the Animatable library to enhance user interaction and engagement throughout the app's UI.

and many more, including code architecture and reusability 

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
