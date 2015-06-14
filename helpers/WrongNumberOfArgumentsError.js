function WrongNumberOfArgumentsError(message) {
    this.message = message;
}

WrongNumberOfArgumentsError.prototype = Error.prototype;

module.exports = WrongNumberOfArgumentsError;