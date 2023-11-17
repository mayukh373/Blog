const validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function ValidateUpdateProfileData(data) {
    let errors = {};
    data.username = isEmpty(data.username)? "" : data.username;

    if (validator.isEmpty(data.username)) errors = "Fields must not be empty!";
    else {
        if (!isEmpty(data.links)) 
            data.links.forEach(link => {
                if (!isEmpty(link.url)) {
                    if (!validator.isURL(link.url)) {
                        errors = "Please enter a valid URL!"
                    }
                }
            });
    }
    return {errors, isValid: isEmpty(errors)};
}