const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');


const authRouter = require('./authRouter/auth');
const patientRouter = require('./routes/patients');
const doctorRouter = require('./routes/doctors');
const {verify_doctor} = require('./middleware/verify_doctor');
const{verify_patient} = require('./middleware/verify_patient');


dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const { Pool } = require('pg');
require('dotenv').config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const pool = new Pool({
    host: PGHOST,
    database: PGDATABASE,
    username: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
    ssl: {
      require: true,
    },
  });



app.use('/api/auth', authRouter);
app.use('/api/patient', patientRouter);
app.use('/api/doctor', doctorRouter);

app.get('/', async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query('select * from courses');
        console.log(result);
        res.status(200).send(result);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
});


app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});