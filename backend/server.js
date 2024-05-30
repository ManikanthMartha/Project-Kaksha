const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');


const authRouter = require('./authRouter/auth');
// const patientRouter = require('./routes/patients');
// const doctorRouter = require('./routes/doctors');
const studentRouter = require('./routes/students');
const {verify_doctor} = require('./middleware/verify_doctor');
const{verify_patient} = require('./middleware/verify_patient');


dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRouter);
app.use('/api/student', studentRouter);
// app.use('/api/patient', patientRouter);
// app.use('/api/doctor', doctorRouter);


app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});