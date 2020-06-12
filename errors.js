'use strict'

class ErrorHandler extends Error {
    constructor(message, statusCode = 400) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

function handleError(err, res) {
    const {statusCode, message} = err;
    res.status(statusCode).json({
        status: "error",
        statusCode,
        message
    })
}

// module.exports = {
//     ErrorHandler,
//     handleError
// };