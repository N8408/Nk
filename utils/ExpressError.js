class ExpressError extends Error {
    constructor(message, statusCode) {
        super(message); // Call the parent constructor with the message
        this.statusCode = statusCode;
        this.name = this.constructor.name;

        // Capture the stack trace (optional but helpful for debugging)
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ExpressError;
