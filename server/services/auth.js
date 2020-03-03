const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("user");
const keys = require("../../config/keys");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

const register = async data => {
    try {
        const { message, isValid } = validateRegisterInput(data);

        if (!isValid) {
            throw new Error(message);
        }

        const { fname, lname, email, password } = data;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error("This email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User(
            {
                fname,
                lname,
                email,
                password: hashedPassword
            },
            err => {
                if (err) throw err;
            }
        )

        user.save();

				const token = jwt.sign({ _id: user._id }, keys.secretOrKey);
    		const id = user._doc._id;
        return { token, loggedIn: true, ...user._doc, id, password: null };

    } catch (err) {
        throw err;
    }

};

const login = async data =>
{
	try {
		const { message, isValid } = validateLoginInput(data);

		if (!isValid) throw new Error(message);

		const user = await User.findOne({ email: data.email });

		if (!user) throw new Error("Invalid Credentials");

		let password_matches = await bcrypt.compareSync(
			data.password,
			user.password
		);
		if (password_matches) {
			const token = jwt.sign({ _id: user._id }, keys.secretOrKey);
			return { token, loggedIn: true, ...user._doc, password: null };
		} else {
			throw new Error("Invalid Credentials");
		}
	} catch (err) {
		throw new Error(err);
	}
};

const logout = async data => {
    try {
        const { _id } = data;
        user = await User.findById(_id);
        const token = "";
        return { token, loggedIn: false, ...user._doc, password: null }
    } catch (err) {
        throw err;
    }
};

const verifyUser = async data => {
    try {
        const { token } = data;
        const decoded = jwt.verify(token, keys.secretOrKey);
        const { _id } = decoded;
        const loggedIn = await User.findById(_id).then(user => {
            return user ? true : false;
        });

        return { loggedIn, _id };
    } catch (err) {
        return { loggedIn: false };
    }
};

const currentUser = async data => {
    try {
        const { token } = data;
        const decoded = jwt.verify(token, keys.secretOrKey);
        const { _id } = decoded;
        const user = await User.findById(_id)
        return user;
    } catch (err) {
        return { user: "No user found."}
    }
}

module.exports = { register, logout, login, verifyUser, currentUser };