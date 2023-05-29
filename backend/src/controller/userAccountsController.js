const AccountsInfo = require("../model/UserAccounts");

// Signup user
const signupUser = async (req, res) => {
    try {
        var item = {
            uname: req.body.uname,  // Update field name from "username" to "uname"
            email: req.body.email,
            password: req.body.password,
            admin: false
        };
        if (item.uname && item.email && item.password) {  // Check if all required fields are provided
            user = await AccountsInfo.findOne({ $or: [{ uname: item.uname }, { email: item.email }] });
            if (user) throw new Error("User already exists.");
            const userAccount = new AccountsInfo(item);
            userAccount.save()
                .then(() => res.json({ status: "Success" }))
                .catch((er) => {
                    console.log(er);
                    if (!res.headersSent)
                        res.status(500).json({ status: "Error" });
                });
        } else {
            res.status(400).json({ status: "Error", message: "Invalid inputs" });
        }
    } catch (error) {
        if (!res.headersSent)
            res.status(500).json({ status: "Error", message: error.message });
    }
};

const adminLogin = async (req, res) => {
    const uname = req.body.username;
    const password = req.body.password;
    try {
        let user = await AccountsInfo.findOne({ uname: uname });
        if (!user) throw new Error("Invalid username or password.");
        const isMatch = await user.isValidPassword(password);
        if (!isMatch) throw new Error("Invalid username or password.");
        res.json({
            status: "Success"
        });
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
};

const isAdmin = (req, res) => {
    if (!req.admin)
        return res.json({ status: "Unauthorized", message: "Only admins can create users" });
    else
        return res.json({ status: "Authorized", message: "User is an admin." });
};

module.exports = {
    signupUser,
    adminLogin,
    isAdmin
};
