const validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function ValidateRegisterData(data) {
    let errors = {};
    
    data.username = isEmpty(data.username)? "" : data.username;
    data.email = isEmpty(data.email)? "" : data.email;
    data.password = isEmpty(data.password)? "" : data.password;

    if (validator.isEmpty(data.username)) errors = "Fields must not be empty!";
    else if (validator.isEmpty(data.email)) errors = "Fields must not be empty!";
    else if (!validator.isEmail(data.email)) errors = "Invalid Email!";
    else if (validator.isEmpty(data.password)) errors = "Fields must not be empty!";
    else if (!validator.isLength(data.password, {min: 5})) errors = "Password must have atleast 5 characters!"
    return {errors, isValid: isEmpty(errors)};
}