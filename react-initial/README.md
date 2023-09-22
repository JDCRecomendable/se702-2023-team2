# NAME OF THE SYSTEM

This system represents the attempt of Team 2 of SOFTENG 702 2023 to build a more open teleconferencing client that is flexible and configurable by users.  It empowers end-users to own their clients, giving them confidence in teleconferencing sessions.  Overall, this research project aims to enhance the teleconferencing experience for everyone.


## Structure

This repository is a monorepo.  It consists of the `frontend` and `backend` packages, located inside the `packages/` directory.  Users of text editors and IDEs such as Visual Studio Code and WebStorm are encouraged to open each package as a self-contained project in their text editor or IDE of choice.  Each package has its own set of linter configuration, etc., that aim to enhance the developer experience.


## Technologies

### Frontend

The `frontend` package uses the following technologies:

* React
* Tailwind CSS

### Backend

The `backend` package uses the following technologies:

* Node.js
* MongoDB
* Express
* JSON Web Tokens (JWTs)

After cloning the repository, the `backend` package will not work straight away.  To get the `backend` package to work, copy `.env.DEFAULT` into `.env`.  Optionally change the `JWT_SIGNING_SECRET` variable in `.env` to a stronger value.
