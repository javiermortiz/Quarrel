const Validator = require("validator");
const validText = require("./valid-text");

module.exports = function validateLoginInput(data) {
    data.email = validText(data.email) ? data.email : "";
    data.password = validText(data.password) ? data.password : "";


    if (Validator.isEmpty(data.email)) {
        return {
					message:
						"No account found for this email. Retry, or Sign up for Quora.",
					isValid: false
				};
    }

    if (Validator.isEmpty(data.password)) {
        return {
					message: "Incorrect password. Reset Password",
					isValid: false
				};
		}
		
		if (!Validator.isEmail(data.email)) {
			return { message: "The email address you entered is not valid.", isValid: false };
		}

		if (!Validator.isLength(data.password, { min: 8 })) {
			return {
				message: "Please use a password at least 8 characters long.",
				isValid: false
			};
		}
    return {
        message: "",
        isValid: true
    };
};

