const express = require('express');
const app = express()
const connectDB = require('./db.js');
const dotenv = require('dotenv');
const authRoutes = require('./routes/commonRoute');

dotenv.config();
connectDB();
app.use(express.json());
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});