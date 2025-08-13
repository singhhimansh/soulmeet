import express from "express";
import User from "../../config/db/schemas/userModel.js";
const authroute = express.Router();

authroute.get("/", (req, res) => {
    res.send("auth accessing");
});

authroute.post("/signup", async (req, res) => {
    try {


        if (!req.body) {
            res.status(400).json({ message: "Request body is missing" });
        }

        const { name, email, password, age, gender } = req.body;
        //hash passwrod

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, age, gender });

        const savedUser = await user.save();
        const token = await savedUser.getJwt();
        res.cookie("token", token);
        res.send("Signup success");
    } catch (error) {
        res.status(400).json({ message: error?.message });
    }
});

authroute.post("/login",async (req, res) => {

    try {
        if (!req.body) {
            res.status(400).json({ message: "Request body is missing" });
        }

        const { email, password } = req.body;

        if(!validator.isEmail(email)){
            return res.status(400).json({ message: "Invalid email" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        
        const token = await user.getJwt();
        res.cookie("token", token);
        res.send("Login success");
    } catch (error) {
        res.status(400).json({ message: error?.message });
    }

});

authroute.post("/logout", (req, res) => {
    res.send("Logout");
});

export default authroute;
