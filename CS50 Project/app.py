import sqlite3
from flask import Flask, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required

# Define app as the Flask application
app = Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Opens connection to database file and returns connection object to access database
def get_db_connection():
    conn = sqlite3.connect('finances.db')
    conn.row_factory = sqlite3.Row
    return conn

# Disables caching of responses
@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

@app.route("/")
@login_required
def index():
    """Show doughnut graph of finances"""
    return render_template("index.html")

@app.route("/add", methods=["GET", "POST"])
def add():
    """Add transaction to database"""

    if request.method == "POST":

        # Obtain transaction amount from user
        transaction = request.form.get("transaction")
        if not transaction:
            return apology("Must enter transaction amount", 400)

        # Obtain transaction type from user
        transaction_type = request.form.get("transaction_type")
        if not transaction_type:
            return apology("Must enter transaction type", 400)

        # Obtains connection object to access database
        conn = get_db_connection()

        # Logs users transaction in database
        conn.execute(
            "INSERT INTO transactions (user_id, transaction_amount, transaction_type, date_time) VALUES (?, ?, ?, datetime('now', 'localtime'))",
            (session["user_id"], transaction, transaction_type))

        # Commits to this action and closes connection to database
        conn.commit()
        conn.close()

        return render_template("index.html")

    else:
        return render_template("add.html")


@app.route("/history")
@login_required
def history():
    """Show history of transactions"""
    # Connects to database and returns object to traverse database
    conn = get_db_connection()

    # Select all transactions of current user
    transactions = conn.execute(
        "SELECT * FROM transactions WHERE user_id = ?",(session["user_id"],)).fetchall()

    # Commit action and closes connection to database
    conn.commit()
    conn.close()

    return render_template("history.html", transactions=transactions)

@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 403)

        # Get database connection
        conn = get_db_connection()

        # Query database for username
        rows = conn.execute("SELECT * FROM user WHERE username = ?", (request.form.get("username"),)).fetchall()

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
            return apology("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Close connection
        conn.close()

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/login")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 400)

        # Connect to database
        conn = get_db_connection()

        # Ensures username does not exist in database
        username_exist = conn.execute("SELECT username from user WHERE username = ?", (request.form.get("username"),)).fetchall()
        if username_exist:
            return apology("username already exists", 400)

        # Ensures password was submitted
        if not request.form.get("password"):
            return apology("must provide password", 400)

        # Ensures password is confirmed
        if not request.form.get("confirmation"):
            return apology("must retype password", 400)

        # Ensures passwords match
        if (request.form.get("password") != request.form.get("confirmation")):
            return apology("passwords must match", 400)

        # Hashes password
        hash = generate_password_hash(request.form.get("password"))

        # Inserts new username and hashed pasword into users database
        conn.execute("INSERT INTO user (username, hash) VALUES(?, ?)", (request.form.get("username"), hash))

        # Commit action
        conn.commit()

        # Remember newly registered user that has just logged in
        id = conn.execute("SELECT id FROM user WHERE username = ?", (request.form.get("username"),)).fetchall()
        session["user_id"] = id[0]["id"]

        # Close connection to database
        conn.close()

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("register.html")