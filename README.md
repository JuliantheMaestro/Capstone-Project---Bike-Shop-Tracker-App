Introduction

The premise of my project is to create an app for a local bike shop where new users can sign up and log in as a volunteer to track volunteer data. This app would be used at the entrance of the bike shop so users log in before working on bikes. Upon signing up and giving out information like name, phone number, email, additional comments, and mechanical experience, the app generates a random 4-digit ID that is not already in the database. With this new ID, the new user can then log in using either the ID or the name they signed up with if they have forgotten their ID. For bike shop admins, there is a special page with a table displaying all of the current volunteers in the database. It also displays additional data like how many times each user has logged in. There is also a "Sync Calendar" button that makes a call to Google Calendar's API and syncs the log-in times for all of the users to a calendar. 



Fulfilled Integrated Features

First Features List
- Use arrays, objects, sets or maps to store and retrieve information that is displayed in your app.
- Analyze data that is stored in arrays, objects, sets or maps and display information about it in your app.
- Use a regular expression to validate user input and either prevent the invalid input or inform the user about it (in all cases prevent invalid input from being stored or saved).

Second Features List 
- Retrieve data from a third-party API and use it to display something within your app.
- Create a form and store the submitted values using an external API (e.g. a contact form, survey, etc).
- Persist data to an external API and make the stored data accessible in your app


Optional Features List
- Create a node.js web server using a modern framework such as Express.js or Fastify.  Serve at least one route that your app uses (must serve more than just the index.html file).
- Interact with a database to store and retrieve information (e.g. MySQL, MongoDB, etc).
- Develop your project using a common JavaScript framework such as React, Angular, or Vue.



How To Run

- Make sure you have access to Git Bash in VSCode 
- The user will need to create a new file in VScode, name the file:  .env
- The user will need to look in my notes for the project submission to get the keys and MONGO_URI
- Install node.js
- Run this command to install all of the dependencies:  npm install
- Run this command to start the server:  Node server.js
- Open a new browser and type this into the url: localhost:3019

Additional Note

- When trying to sync user login information to google calendar upon clicking the sync button you may need to click the link in the VScode terminal to authenticate in order for the Google login pop up to show. Once you are properly logged into your google account it will sync to Google Calendar
