function getSessionErrorData(req, defaultValues) {
    let sessionInputData = req.session.inputData;

    if(!sessionInputData) {
        sessionInputData = {
            hasError: false,
            ...defaultValues
        };
    };

    req.session.inputData = null;

    return sessionInputData;
};

function flashErrorsToSession(req, data, action) {
    req.session.inputData = {
        hasError: true,
        ...data
    };

    // Function will be executed after saving
    req.session.save(action);
};

module.exports = {
    getSessionErrorData: getSessionErrorData,
    flashErrorsToSession: flashErrorsToSession
};