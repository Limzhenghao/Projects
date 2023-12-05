function checkAuthStatus(req, res, next) {
    let userId = null;
    try {
        userId = req.session.user.id;
    } catch(error) {
        if(!userId || userId == undefined) {
            return next();
        };
    } finally {
        // Always executed before control flow exits the function
        res.locals.userId = userId;
        res.locals.isAuth = req.session.isAuthenticated;
        res.locals.isAdmin = req.session.isAdmin;

        next();   
    }
}

module.exports = {
    checkAuthStatus: checkAuthStatus
}