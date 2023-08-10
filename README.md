# QuizWiz Installation Instructions  
## Getting the Source Code  
- Open a terminal or command prompt. 
- Navigate to the local project directory. 
(If you already have the source code you can skip the next steps for this section.) 
- Use git clone to retrieve the source code from the GitHub repository.
  ```git clone https://github.com/peterspr/QuizWiz.git```
- Navigate into the cloned directory
  ```cd QuizWiz```
## Installing Dependencies
- If you do not have nodejs and npm installed on your machine, follow the steps found [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to do so.
### Client
-   Navigate to quiz-wiz (the client side folder) from the parent directory.
```cd quiz-wiz```
- Install the dependencies using npm.
```npm install```
  - (This will step through the dependencies in package.json and install them)
- Create a build.
```npm run build```
  - (This will create a compiled and optimized build that can be served to the user)
-   Return to the parent directory.
```cd ..```
### Server
- Navigate to QuizWiz_Server (the server side folder) from the parent directory.
```cd QuizWiz_Server```
- Install the dependencies using npm.
```npm install``` 
  - (This will step through the dependencies in package.json and install them)
## Run a Local Server

The source files are now ready to be deployed. There are other ways of deploying a node server, but here are instructions for hosting a local server.

- Navigate to QuizWiz_Server (the server side folder) from the parent directory.
```cd QuizWiz_Server```
- Run npm start
```npm start```
  - (This will start a local server on localhost:8080)
- Open a browser and navigate to localhost:8080
- QuizWiz is deployed and ready to use!