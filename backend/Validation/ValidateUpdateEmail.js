const validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function ValidateUpdateEmail(data) {
    let errors = {};
    data.email = isEmpty(data.email)? "" : data.email;

    if (validator.isEmpty(data.email)) errors = "Field must not be empty!";
    else if (!validator.isEmail(data.email)) errors = "Invalid Email!";
    
    return {errors, isValid: isEmpty(errors)};
}