function userIsValid(enteredEmail, enteredConfirmEmail, enteredPassword, enteredFullName, enteredStreet, enteredPostalCode, enteredCity) {
    return (
        enteredEmail &&
        enteredConfirmEmail &&
        enteredPassword &&
        enteredEmail === enteredConfirmEmail &&
        enteredPassword.trim().length >=6 &&
        enteredEmail.includes('@') &&
        enteredFullName &&
        enteredStreet &&
        enteredPostalCode &&
        enteredCity
    );
};

module.exports = {
    userIsValid: userIsValid
};