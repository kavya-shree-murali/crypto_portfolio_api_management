const { User } = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register User
const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ msg: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ email, password: hashedPassword });

        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ msg: "Register successfully...!" });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

// Login User
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ msg: "Login successfully", token: token });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

module.exports = {
    register,
    login
}
