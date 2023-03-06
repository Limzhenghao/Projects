# Personal finance
#### Video Demo:  <https://youtu.be/v0sHZyXGT2w>
#### Project description: This web application allows people to budget their income and track their expenses.
Initially, when I was thinking about what to do for my project, I was considering making something that would benefit either myself or the larger community. After talking to a few of my friends, I realised that they were all going into the next phase of their lives very soon, and will be transitioning into adulthood. I noticed that they were all more concerned of their finances and wanted something that could help them budget their monthly income as well as track their expenses for the month in order to ensure that they were not spending too much. This gave me inspiration for this project, which I then brought to life.

#### Explanation of main files
These main files form the backbone of this web application.

###### app.py
The main file of my project, app.py, initialises the flask application, configures the session and contains all the app routes.
- "/" loads in the main page of my web app, index.html.
- "/add" allows users to add their transaction amount and type and the app stores it into the database, finances.db.
- "/history" shows users a table of their past transactions by querying the database.
- "/login" obtains login details the user entered and checks that they are valid before allowing the user access to the rest of the website.
- "/logout" clears the user id, effectively logging the user out.
- "/register" obtains details from the user and ensures that they are valid before storing user's information in the database and logs them in at the same time.

###### finances.db
The database file which I created uses the language sqlite3 and stores 2 tables.
- "user" which stores the basic information of the user including the id, username and password in a hash format.
- "transactions" which contains the user id of whoever entered that transaction, the transaction amount and type and the date and time of the transaction.

###### helpers.py
This file contains 2 functions that will be called in app.py but are seperated to allow app.py to be more clean and concise.
- "apology" returns apology.html with a error message and code in a meme photo.
- "login_required" returns the user to the login page if they are not logged in anytime they access a function which requires them to be logged in.

###### requirements.txt
This file contains the requirements for Flask to run.

#### Templates
- Inside the templates folder contain all the html files that load up the webpages.

###### add.html
- Contains 2 input boxes for the user to submit their transaction amount and type and a submit button.

###### apology.html
- Returns the error message and code inside a meme photo.

###### history.html
- Loads the table of past transactions for the user.

###### index.html
- Contains the doughnut chart as well as 3 input boxes and a submit button which allows the user to budget their income and obtain a visual representation instantaneously according to their input.
- Serves as the mainpage of my web app.

###### layout.html
- Creates the general layout of the rest of the page such as the navbar and the text at the bottom.
- Contains the CDN for bootstrap which helps make the web app more presentable.

###### login.html
- Contains 2 input boxes and a submit button to log the user in.

###### register.html
- Contains 3 input boxes - a username box, password and confirm password boxes and a register button for new user to register.



