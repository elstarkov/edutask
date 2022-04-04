# PA1417 Testing system

This system implements a simple task list, in which YouTube videos can be associated to todo lists in order to keep track of educational material. Please keep the following in mind:

* The system contains intended flaws, which are to be identified applying test techniques.
* The system is a work-in-progress, meaning that some functionalities are not yet implemented. Focus on the functionalities that already exist, everything else can be disregarded for now.

## Setup

### Prerequisites

In order to successfully run the system, the following needs to be available on your machine:

* Database: [MongoDB](https://www.mongodb.com/try/download/community)
* Server: [python](https://www.python.org/downloads/) and [pip](https://pypi.org/project/pip/)
* Frontend: [nodejs](https://nodejs.org/en/download/)

### Installing

The following steps need to be performed before running the system for the first time:

1. In the root folder of this repository, create the folders data\db
2. In the folder backend/, run the following command to install all relevant python packages:
> pip install -r requirements.pip
3. in the folder frontend/, run the following command to install all relevant node packages:
> npm install

### Running

The following steps need to be performed in order to start the system:

1. Navigate a shell to the root folder of this repository and run the following command (you might need admin rights for this):
> mongod --port 27017 --dbpath data\db
2. Navigate a different shell to the folder backend/ and run 
> python ./main.py
3. Navigate a third shell into the folder frontend/ and run
> npm start

Now a browser window should open and display the frontend of the system.

## Interaction

You can interact with the system in different ways. Here are a few to explore the different components of the system:

1. To interact with the database directly, you can use the [MongoDB Compass](https://www.mongodb.com/try/download/compass): while the database is running, connect to it via the compass interface using the connection string mongodb://localhost:27017. You can now see and manipulate all data in the database manually. Alternatively, you can use the [MongoDB Shell](https://www.mongodb.com/try/download/shell).
2. To interact with the server directly, you can use a service like [Postman](https://www.postman.com/downloads/): while the database and server are running, create a new collection in the Postman GUI and "add requests". Select a HTTP method and an URL, for example GET http://localhost:5000/users/all. You can find all available API endpoints in the backend/src/blueprints/ folder or by inspecting the console of your server, where all API endpoints are printed when starting the server. Alternatively, you can use any browser to interact with the API of the server.
3. To interact with the frontend directly, simply use the browser which is opened when running npm start. The frontend can be accessed at http://localhost:5000