const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');


const authRouter = require('./authRouter/auth');
const studentRouter = require('./routes/students');

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRouter);
app.use('/api/student', studentRouter);

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});