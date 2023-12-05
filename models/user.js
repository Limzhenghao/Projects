const db = require('../data/database');
const bcrypt = require('bcrypt');

// Creates User class using entered information
class User {
    constructor(email, enteredPassword, enteredFullName, enteredStreet, enteredPostalCode, enteredCity) {
        this.email = email;
        this.enteredPassword = enteredPassword;
        this.enteredFullName = enteredFullName;
        this.enteredStreet = enteredStreet;
        this.enteredPostalCode = enteredPostalCode;
        this.enteredCity = enteredCity;
    }

    // Inserts user information into database, 'users' collection
    async signUp() {
        const hashedPassword = await bcrypt.hash(this.enteredPassword, 12);

        const result = await db.getDb().collection('users').insertOne({
            email: this.email,
            password: hashedPassword,
            fullName: this.enteredFullName,
            street: this.enteredStreet,
            postalCode: this.enteredPostalCode,
            city: this.enteredCity
        });
        return result;
    }

    // Checks if user login information is valid
    async login() {
        const customerResult = await db.getDb().collection('users').findOne({
            email: this.email
        });

        const result = await bcrypt.compare(this.enteredPassword, customerResult.password);

        return result;
    }

    // Fetch user using email
    async fetchUser() {
        const customerResult = await db.getDb().collection('users').findOne({
            email: this.email
        });

        return customerResult;
    }
}

module.exports = User;