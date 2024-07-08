## Questions

### What issues, if any, did you find with the existing code?
- The DockerFile WORKDIR in UI needed to be updated to WORKDIR /usr/src/app
- The DockerFile WORKDIR in API needed to be updated to WORKDIR /usr/src/app
- ```docker run build``` command in the README needs to be updated to:
  - ```docker-compose build```
  - ```docker-compose up -d```
- installed dotenv and then used it in the api index.ts
- I could not run npm start at first. The reason being is the npm start script in package.json (PORT=3001 react-scripts start) does not work properly in windows. Setting environment variables directly in the npm start script with the syntax PORT=3001 works on Unix-based systems (like Linux and macOS) but not on Windows. I did the following to fix this:
  1. ```npm install cross-env``` (this package allows you to set env variables on all platforms)
  2. update package.json as follows:
    ``` "scripts": {
      "start": "cross-env PORT=3001 react-scripts start"
    }``` 

### What issues, if any, did you find with the request to add functionality?
- Not sure if this is related to "type" issues or if it was an issue with my docker setup, but for some reason the functions weren't returning the right account numbers or amount numbers sometimes when I did GET or PUT requests at first so I made sure to specify the "types" inside the accountHandler functions to numbers for the number values. In general, this is a good practice to do anyway when dealing with complex backend logic. 
- Also I added a line of code in accounts.ts to have the account number schema be a number always (this might not be a big issue for this challenge but it's just good practice + I did it for diagnosing purposes)
  - ```Schema = Joi.number().integer().required();```
- I had to install dotenv in order to load environment variables from .env file. Prior to me setting this up, I was getting back "Server is running on port undefined"
- I ran into an error "relation 'transactions' does not exist" when making some of my new withdrawl or deposit requests. This usually indicates that the transactions table has not been created in the database for the new logic that I added. to fix this, I created an SQL script to create the transactions table and ensure it is executed when the PostgreSQL container starts. The script is in the root folder called init-transactions.sql

### Would you modify the structure of this project if you were to start it over? If so, how?
I would move the AccountDashboard.tsx and Signin.tsx component into a new folder called "screens" or "pages". I like having the "components" folder to be dedicated to strictly 
reusable components (such as buttons, search bars, banners, etc). Basically things that get reused multiple times. From a UI perspective, I would also create a folder/file for global styling variables as well for things like the button color, text input fields, etc.

### Were there any pieces of this project that you were not able to complete that you'd like to mention?

### If you were to continue building this out, what would you like to add next?
- I would try to add better error handling with login screen
- Add error + success handling in the UI when you click "submit" for either deposit or withdrawl (I added a simple one in this app for now inside AccountDashboard.tsx. I used the SnackBar and Alert library in material ui. For me it was easier to track success + failed in the UI vs checking logs/terminal every time)
- I would remove the option to have negative numbers in the input fields (in the login screen, deposit, withdrawl, etc) I would also add checks in all the functions to make sure no negative numbers are being used.
- I noticed there were some functions that did not have type checks (strings should be Numbers, etc) I would flesh out the app with more type checks 
- Add more of a secure login experience (user, password, otp, etc)
- in the api handlers I would add more detailed or standardized query recording standards so that there are consistent messaging
- update Docker Compose Version in .yml file 
- for security, I would add some tools with the backend code to prevent unauthroized access or attacks to personal data. Some examples would be 
  - authentication mechanisms like OAuth or JWT (basically add middlewear used to create tokens betweem user inputs and route handling)
  - front end input validation
  - rate limiting middlewear to prevent excess server requests
  - security headers

### If you have any other comments or info you'd like the reviewers to know, please add them below.
I had fun building this out :) thank you for letting me take part in this coding challenge.