const validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function ValidateLoginData(data) {
    let errors = {};
    
    data.email = isEmpty(data.email)? "" : data.email;
    data.password = isEmpty(data.password)? "" : data.password;

    if (validator.isEmpty(data.email)) errors = "Fields must not be empty!";
    else if (!validator.isEmail(data.email)) errors = "Invalid Email!";
    else if (validator.isEmpty(data.password)) errors = "Fields must not be empty!";
    return {errors, isValid: isEmpty(errors)};
}