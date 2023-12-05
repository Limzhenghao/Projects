function createUserSession(req, user, action) {
    req.session.user = { id: user._id.toString(), email: user.email };
    req.session.isAuthenticated = true;
    req.session.isAdmin = user.isAdmin;
    req.session.save(action);
};

function destroyUserSession(req, action) {
    req.session.user.id = null;
    req.session.isAuthenticated = false;
    req.session.isAdmin = false;
    req.session.save(action);
};

module.exports = {
    createUserSession: createUserSession,
    destroyUserSession: destroyUserSession
};