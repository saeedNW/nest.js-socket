<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# nest.js-socket

This is a simple practice **NestJS Socket-based Chat Application** designed to demonstrate the implementation of real-time communication features using WebSockets. The application allows users to create chat rooms and exchange messages in real-time. It serves as a foundational project to understand WebSocket integration in a NestJS framework and is built with modularity and scalability in mind.

## Table of Content

- [nest.js-socket](#nestjs-socket)
  - [Table of Content](#table-of-content)
  - [Key features](#key-features)
  - [Prerequisites](#prerequisites)
  - [Technologies Used](#technologies-used)
    - [Backend technologies](#backend-technologies)
    - [Utilities](#utilities)
  - [Installation and Setup](#installation-and-setup)
  - [Compile and run the project](#compile-and-run-the-project)
    - [Backend](#backend)
    - [Frontend](#frontend)
  - [License](#license)
  - [Contributors](#contributors)

## Key features

- **Authentication**: Users can register and login into the system using OTP structure.
- **Profile manager**: Users can Update their profile image and username.
- **Chat Room Management**: Create and join groups or private chat rooms.
- **Real-time Messaging**: Send and receive messages instantly using WebSockets.
- **Hybrid Structure**: Supports both REST APIs for user and rooms management and WebSocket gateways for real-time events.

## Prerequisites

Before running the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [NestJS](https://nestjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Visual Studio Code](https://code.visualstudio.com/)

## Technologies Used

The project utilizes a modern tech stack to ensure real-time functionality, scalability, and maintainability:

### Backend technologies

- **[NestJS](https://nestjs.com/)**: A progressive framework for building efficient and scalable server-side applications.
- **[Socket.IO](https://socket.io/)**: A library for enabling real-time, bidirectional communication between clients and servers using WebSockets.  
- **[Mongoose](https://mongoosejs.com/)**: An ODM (Object Data Modeling) library for MongoDB, enabling easy schema and data management.
- **[MongoDB](https://www.mongodb.com/)**: A NoSQL database for storing chat room data and messages.

### Utilities

- **Environment Variables**: Configuration via `.env` files for managing sensitive data securely.
- **[Multer](https://github.com/expressjs/multer)**: Middleware for handling file uploads in the application.

## Installation and Setup

In order to get this application up and running on your local machine, follow the
steps below.

1. Clone the repository from GitHub:

   ```shell
   git clone https://github.com/saeedNW/nest.js-socket.git
   ```

2. Navigate to the project directory:

   ```shell
   cd nest.js-socket
   ```

3. Install project dependencies:

   ```shell
   npm install
   ```

Note that the application default Listing port is `3000`.

## Compile and run the project

To start and manage the back-end side of the project, use the following scripts:

### Backend

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# build production
$ npm run build

# production mode
$ npm run start:prod
```

### Frontend

To start the front-end:

1. Install the **Live Server** extension in **Visual Studio Code**.
2. Open the `/client/index.html` file in VS Code.
3. From the statusbar click on **Go Live**.
4. The front-end will be served locally, and you can access it in your browser.

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## Contributors

We would like to thank the following individuals who have contributed to the development of this application:

![avatar](https://images.weserv.nl/?url=https://github.com/erfanyousefi.png?h=150&w=150&fit=cover&mask=circle&maxage=5d)
‎ ‎ ‎ ![avatar](https://images.weserv.nl/?url=https://github.com/saeedNW.png?h=150&w=150&fit=cover&mask=circle&maxage=5d)

[**Erfan Yousefi - Supervisor and instructor of the nest.js programming course**](https://github.com/erfanyousefi/)

[**Saeed Norouzi - Back-end Developer**](https://github.com/saeedNW)
