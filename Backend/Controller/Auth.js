const User = require("../model/user");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userName = await User
            .findOne({ name: name });
        if (userName) {
            return res.status(400).json({ message: "UserName already exists, Change it" });
        }

        
        const userEmail = await User
            .findOne({ email: email });

        if (userEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name: name,
            email: email,
            password: hashPassword
        });
        await user.save();
        res.status(200).json({ message: "Signup Successfull", user: user });

    }
    catch {
        res.status(500).json({ message: "Something went wrong to SingUp" });
    }
}

exports.login = async (req, res) => {
    try {
        const { name, password } = req.body;

        const userExist = await User.findOne({ name: name });
        if (!userExist) {
            return res.status(400).json({ message: "user not found" });
        }

        const hashedPassword = await bcrypt.compare(password, userExist.password);
        if (!hashedPassword) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        return res.status(200).json(
            {
                message: "login successfull",
                user: userExist
            }
        )

    } catch {
        res.status(500).json({ message: "Something went wrong to login" });
    }
}

exports.getAlluser = async (req ,res) => {
    try {
     const { id } = req.body;
     
     const users = await User.find({
        _id : {
            $ne : id
        }
     });

     console.log(users);
     return res.status(200).json({
        message:"all user send",
        users
     })

    } catch {
        res.status(500).json({ message: "Something went wrong to getUser" });
    }
}