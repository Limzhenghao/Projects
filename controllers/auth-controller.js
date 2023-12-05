const User = require("../models/user");
const validation = require("../util/validation");
const validationSession = require("../util/validation-session");
const authentication = require("../util/authentication");

// Loads sign up form
function userSignUpForm(req, res) {
  let sessionErrorData = validationSession.getSessionErrorData(req, {
    email: "",
    confirmEmail: "",
    password: "",
    fullName: "",
    street: "",
    postalCode: "",
    city: "",
  });
  res.render("signup", { inputData: sessionErrorData });
};

// Loads user log in form
function userLoginForm(req, res) {
  let sessionErrorData = validationSession.getSessionErrorData(req, {
    email: "",
    password: "",
  });
  res.render("login", { inputData: sessionErrorData });
};

// User sign up function when user submits sign up form
async function userSignUpFunction(req, res, next) {
  const userData = req.body;
  const enteredEmail = userData.email;
  const enteredConfirmEmail = userData["confirm-email"];
  const enteredPassword = userData.password;
  const enteredFullName = userData["full-name"];
  const enteredStreet = userData.street;
  const enteredPostalCode = userData["postal-code"];
  const enteredCity = userData.city;

  // Checks if information entered is valid
  if (
    !validation.userIsValid(
      enteredEmail,
      enteredConfirmEmail,
      enteredPassword,
      enteredFullName,
      enteredStreet,
      enteredPostalCode,
      enteredCity
    )
  ) {
    validationSession.flashErrorsToSession(
      req,
      {
        message:
          "Invalid input - please ensure all fields are filled in and password is at least 6 characters long",
        email: enteredEmail,
        confirmEmail: enteredConfirmEmail,
        password: enteredPassword,
        fullName: enteredFullName,
        street: enteredStreet,
        postalCode: enteredPostalCode,
        city: enteredCity,
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  };

  // Creates new User class for new customer sign up
  const user = new User(
    enteredEmail,
    enteredPassword,
    enteredFullName,
    enteredStreet,
    enteredPostalCode,
    enteredCity
  );

  // Check if user's email already exists in the database
  let existingUser;
  try {
    existingUser = await user.fetchUser();
  } catch(error) {
    next(error);
    return;
  };

  if (existingUser) {
    validationSession.flashErrorsToSession(
      req,
      {
        message: "User exists already!",
        email: enteredEmail,
        confirmEmail: enteredConfirmEmail,
        password: enteredPassword,
        fullName: enteredFullName,
        street: enteredStreet,
        postalCode: enteredPostalCode,
        city: enteredCity,
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  };

  // Stores user information in database
  try {
    await user.signUp();
  } catch(error) {
    next(error);
    return;
  };

  res.redirect("/login");
};

// User login function
async function userLoginFunction(req, res, next) {
  const userData = req.body;
  const enteredEmail = userData.email;
  const enteredPassword = userData.password;

  // Creates new User class
  const user = new User(enteredEmail, enteredPassword);

  // Checks if user exists in database
  let existingUser;
  try {
    existingUser = await user.fetchUser();
  } catch(error) {
    next(error);
    return;
  }

  if (!existingUser) {
    validationSession.flashErrorsToSession(
      req,
      {
        message: "Could not log you in - please check your credentials!",
        email: enteredEmail,
        password: enteredPassword,
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  };

  // Checks if user's login information matches those in the database
  let loginSuccessful;
  try {
    loginSuccessful = await user.login();
  } catch(error) {
    next(error);
    return;
  };

  if (!loginSuccessful) {
    validationSession.flashErrorsToSession(
      req,
      {
        message: "Could not log you in - please check your credentials!",
        email: enteredEmail,
        password: enteredPassword,
      },
      function () {
        res.redirect("/login");
      }
    );
    return;
  }

  // Stores user info in session
  authentication.createUserSession(req, existingUser, function () {
    res.redirect("/");
  });
}

function userLogoutFunction(req, res) {
  authentication.destroyUserSession(req, function () {
    res.redirect("/login");
  });
}

module.exports = {
  userSignUpForm: userSignUpForm,
  userLoginForm: userLoginForm,
  userSignUpFunction: userSignUpFunction,
  userLoginFunction: userLoginFunction,
  userLogoutFunction: userLogoutFunction
};
