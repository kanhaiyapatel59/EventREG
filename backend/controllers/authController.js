import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // 2. Hash the password (scramble it)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create and save user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // 2. Compare password with hashed password in DB
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        // 3. Create JWT Token (The ID Card)
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            'secret_key_123', // In the future, we will move this to .env
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};