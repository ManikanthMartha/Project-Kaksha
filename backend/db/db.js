// const {takeCare} = require('../genai/ai');
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

async function test (req,res) {
    const client = await pool.connect();
    try {
        const result = await client.query('select * from students');
        console.log(result);
        res.status(200).send(result);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
}
//slot time defined for each 10 slots and always sent to frontend whenever the slot_no is passed
const slot_time = {
    1 : "9:00 AM - 10:00 AM",
    2 : "10:00 AM - 11:00 AM",
    3 : "11:00 AM - 12:00 PM",
    4 : "12:00 PM - 1:00 PM",
    5 : "1:00 PM - 2:00 PM",
    6 : "3:00 PM - 4:00 PM",
    7 : "4:00 PM - 5:00 PM",
    8 : "5:00 PM - 6:00 PM",
    9 : "6:00 PM - 7:00 PM",
    10 : "7:00 PM - 8:00 PM"
};
//sending usernames according to role 
async function docusers(email) {
    const client = await pool.connect();
    console.log(email);
    try {
        //seeing if for that role that username exists
        //const result  = await pool.query('SELECT email FROM doctors_login WHERE email=?', [email]);
        const result = await client.query(`select email from doctors where email='${email}'`);//do this instead of ? and also email is string so ' ' has to be there
        console.log(result);
        //result is object has rows property with array of objects and so first ka lenge ya array ka length is 0
        if(result.rows.length === 0){//no user
            return null;
        }
        //if username is there then
        const Email = result.rows.map(Email => Email.email);//rows is array so map on array rows[0] gets object
        console.log(Email);
        return Email[0];
    }
    catch (err) {
        console.log(err);
        throw err;
    }
    finally{
        client.release();
    }
}
//returning password from the db
async function docpassword(email){
    const client = await pool.connect();
    try{
        //get password object
        const result = await client.query(`SELECT password FROM doctors WHERE email = '${email}'`);
        const pass = result.rows.map(pass => pass.password);
        console.log(pass);
        return pass[0];
    }catch(err){
        console.log(err);
        throw err;
    }
    finally{
        client.release();
    }
}
//returning the doctor_id based on username
async function doctor_id(email){
    const client = await pool.connect();
    try{
        const result = await client.query(`select doctor_id from doctors where email = '${email}'`);
        doctor_id = result.rows.map(doctor_id => doctor_id.doctor_id);
        console.log(doctor_id);
        return doctor_id[0];
    }catch(err){
        console.log(err);
        throw err;
    }
    finally{
        client.release();
    }
}
async function patusers(email) {
    const client = await pool.connect();
    try {
        //seeing if for that role that username exists
        const result  = await client.query(`select email from patients where email = '${email}'`);
        console.log(result);
        if(result.rows.length === 0){//no user
            return null;
        }
        //if username is there then
        const Email = result.rows.map(Email => Email.email);
        console.log(Email);
        return Email[0];
    }
    catch (err) {
        console.log(err);
        throw err;
    }
    finally{
        client.release()
    }
}
//returning password from the db
async function patpassword(email){
    const client = await pool.connect();
    try{
        //get password object
        const result = await client.query(`select password from patients where email = '${email}'`);
        pass = result.rows.map(pass => pass.password);
        console.log(pass);
        return pass[0];
    }catch(err){
        console.log(err);
        throw err;
    }
    finally{
        client.release();
    }
}
async function patient_id(email){
    const client = await pool.connect();
    try{
        const result = await client.query(`select patient_id from patients where email = '${email}'`);
        patient_id = result.rows.map(patient_id => patient_id.patient_id);
        console.log(patient_id);
        return patient_id[0];
    }catch(err){
        console.log(err);
        throw err;
    }
}



//returning the patient details from the database
async function getpatientData(req, res) {
    console.log(req.params.id);
    const client = await pool.connect();
    try {
        const id = req.params.id; // Getting the patient_id from the authenticated wala
        const patient_info = await client.query(`SELECT patient_id,name,gender,contact,address,email FROM patients WHERE patient_id = '${id}'`);
        const medical_history = await client.query(`SELECT patient_id,diagnosis,date_of_diagnosis,treatment_given,family_history FROM medical_history WHERE patient_id = '${id}'`);
        //having two doctor recommended test and patient tests
        // const doc_tests = await client.query(`select t.test_name,t.recommendation_date,d.name as doctor_name from tests_recommended as t join doctors as d on t.doctor_ID = d.doctor_id where t.patient_id = '${id}'`);
        const pat_tests = await pool.query(`select test_name,result,date_taken from tests_taken where patient_id = '${id}'`);
        console.log(pat_tests);
        if (patient_info.rows.length === 0) {//if no record then the query gives an empty array
            return res.status(404).send({ error: 'Patient not found' });
        }

        const responseData = {
            patient_info: patient_info.rows[0], // Assuming patient_info has only one record
            medical_history: medical_history.rows.length > 0 ? medical_history.rows[0] : null,
            // doctor_recommended_tests: doc_tests.rows.length > 0 ? doc_tests.rows[0] : null,
            patient_taken_tests: pat_tests.rows.length > 0 ? pat_tests.rows : null
        };

        res.status(200).json(responseData);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

//when the patient is new and enters the detials and posted
async function addpatientData(personal_array,medical_array,test_array) {//to do something missing ka hai like patid adding then inserting ka and all
    // try {
    //     const patId = req.Patient_ID;//new user shd be given a new pat id check how
    //     const { patient_info, medical_history, tests } = req.body;
    //     // Validate patient_info
    //     const patientInfoKeys = ['first_name', 'last_name', 'gender', 'address', 'contact', 'email'];//age ka see once add that
    //     if (!validateFields(patient_info, patientInfoKeys)) {
    //         return res.status(400).send({ message: 'Missing or invalid fields in patient_info' });
    //     }

    //     // Validate medical_history
    //     const medicalHistoryKeys = ['Diagnosis', 'Date_of_Diagnosis', 'Treatment_received', 'chronic_conditions'];
    //     if (!validateFields(medical_history, medicalHistoryKeys)) {
    //         return res.status(400).send({ message: 'Missing or invalid fields in medical_history' });
    //     }

    //     // Validate tests
    //     const testsKeys = ['test_name', 'test_date', 'test_result'];
    //     if (!validateFields(tests, testsKeys)) {
    //         return res.status(400).send({ message: 'Missing or invalid fields in tests' });
    //     }

    //     // Insert data into respective tables
    //     await pool.query('INSERT INTO patient_info SET ?', patient_info);
    //     await pool.query('INSERT INTO medical_history SET ?', medical_history);
    //     await pool.query('INSERT INTO patient_tests SET ?', tests);//set will tell to which columns which are in tests properties

    //     res.status(201).send({ message: 'Patient data added successfully' });
    // } catch (err) {
    //     console.error('Error:', err);
    //     res.status(500).send({ error: 'Internal Server Error' });
    // }
    // /*
    // if the query ka error comes then to handle that (whenevr a error in query it comes as sqlmessage ka in th error object)
    // catch (err) {
    //     console.error('Error:', err);
    //     if (err.code === 'ER_DUP_ENTRY') { // Check for duplicate entry error(are codes of query error)
    //         return res.status(400).send({ error: 'Duplicate entry error: This patient already exists' });
    //     } else if (err.code === 'ER_NO_REFERENCED_ROW') { // Check for foreign key constraint violation
    //         return res.status(400).send({ error: 'Foreign key constraint violation: Invalid reference' });
    //     } else if (err.message.includes('your_constraint_name')) { // Check for specific constraint violation
    //         return res.status(400).send({ error: 'Constraint violation: Your specific constraint message here' });
    //     }
        
    //     res.status(500).send({ error: 'Internal Server Error' });
    // }
    console.log(personal_array,medical_array,test_array);
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT insert_patient($1, $2, $3, $4, $5, $6, $7)', [
            personal_array.name,
            personal_array.gender,
            personal_array.age,
            personal_array.contact,
            personal_array.address,
            personal_array.email,
            personal_array.password
        ]);
        console.log(result);
        // Extract the patient ID from the result
        const patientId = result.rows[0].insert_patient;
        console.log('Patient ID:', patientId);
        console.log(medical_array.treatment_given);
        const result2 = await client.query(`CALL insert_medical_history('${patientId}', '${medical_array.diagnosis}','${medical_array.date_of_diagnosis}', '${medical_array.treatment_given}', '${medical_array.family_history}' )`);
        console.log(result2);
        for (const test of test_array) {
            const result3 = await client.query('CALL insert_tests_taken($1, $2, $3, $4)', [
                patientId,
                test.test_name,
                test.result,
                test.date_taken
            ])
            console.log(result3);
        }
        return true;
    }
    catch(err) {
        console.error('Error:', err);
        return false;
    }
    finally{
        client.release();
    }
}

function validateFields(data, requiredKeys) {
    for (const key of requiredKeys) {
        if (!data.hasOwnProperty(key) || data[key] === null || data[key] === undefined || data[key] === '') {
            return false;
        }//.hasOwnPropery will check if the key is present in the object(here data)
    }
    return true;
}

//upcoming appointments sending for the patient dashboard
async function dashboardSend(req, res) {
    const client = await pool.connect();
    try {
        const id = req.params.id;
        console.log(id);
        const appointmentsResult = await client.query(`SELECT d.name as Doctor_name, a.Date_of_appointment, a.slot_no, a.appointment_id FROM appointments a JOIN doctors d ON a.doctor_id = d.doctor_id  WHERE a.patient_id = '${id}' AND status = 'pending'`);
        
        const prescriptionResult = await client.query(`SELECT p.appointment_id,p.medication_Name, p.dosage, p.frequency,d.name as Doctor_Name FROM prescriptions p JOIN doctors d ON p.doctor_id = d.doctor_id WHERE p.patient_id = '${id}'`);
   
        const testsResult = await client.query(`SELECT t.test_name, d.name as doctor_name,t.result as test_result FROM tests_recommended t JOIN doctors d ON t.doctor_ID = d.doctor_id WHERE t.patient_id = '${id}'`);//getting only doctor tests recommended by doctors

        //if multiple are there to get that will be in array of objects
        const responseData = {
            appointments: appointmentsResult.rows.length > 0 ? appointmentsResult.rows : null,
            doctor_recommended_prescription: prescriptionResult.rows.length > 0 ? prescriptionResult.rows : null,
            doctor_recommended_tests: testsResult.rows.length > 0 ? testsResult.rows : null,
            slot_timings: slot_time
        };


        res.status(200).send(responseData);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
    finally{
        client.release();
    }
}
async function dashboardSendold(req, res) {
    const client = await pool.connect();
    try {
        const id = req.params.id;
        console.log(id);
        const appointmentsResult = await client.query(`SELECT d.name as Doctor_name, a.Date_of_appointment, a.slot_no, a.appointment_id FROM appointments a JOIN doctors d ON a.doctor_id = d.doctor_id  WHERE a.patient_id = '${id}' AND status = 'done'`);
        
        const prescriptionResult = await client.query(`SELECT p.appointment_id,p.medication_Name, p.dosage, p.frequency,d.name as Doctor_Name FROM prescriptions p JOIN doctors d ON p.doctor_id = d.doctor_id WHERE p.patient_id = '${id}'`);
   
        const testsResult = await client.query(`SELECT t.test_name, d.name as doctor_name,t.result as test_result FROM tests_recommended t JOIN doctors d ON t.doctor_ID = d.doctor_id WHERE t.patient_id = '${id}'`);//getting only doctor tests recommended by doctors

        //if multiple are there to get that will be in array of objects
        const responseData = {
            appointments: appointmentsResult.rows.length > 0 ? appointmentsResult.rows : null,
            doctor_recommended_prescription: prescriptionResult.rows.length > 0 ? prescriptionResult.rows : null,
            doctor_recommended_tests: testsResult.rows.length > 0 ? testsResult.rows : null,
            slot_timings: slot_time
        };


        res.status(200).send(responseData);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
    finally{
        client.release();
    }
}

async function dashboardPrescription(req, res) {
    const client = await pool.connect();
    try {
        const id = req.params.id;
        console.log(id);
        const prescriptionResult = await client.query(`SELECT p.appointment_id,p.medication_Name, p.dosage, p.frequency,d.name as Doctor_Name FROM prescriptions p JOIN doctors d ON p.doctor_id = d.doctor_id WHERE p.appointment_id = ${id}`);
        //if multiple are there to get that will be in array of objects
        const responseData = {
            // appointments: appointmentsResult.rows.length > 0 ? appointmentsResult.rows : null,
            doc_prescription: prescriptionResult.rows.length > 0 ? prescriptionResult.rows : null,
            // doctor_recommended_tests: testsResult.rows.length > 0 ? testsResult.rows : null,
            // slot_timings: slot_time
        };


        res.status(200).send(responseData);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
    finally{
        client.release();
    }
}


//when the patient enters the appointment booking he selects the department and the date(day is got)
async function availableDoctors(req, res) {
    const client = await pool.connect();
    try {
        const department = req.body.department;
        const date = req.body.date;//in format of yyyy-mm-dd
        console.log(date);
        console.log(department);
        // Extract day from date
        const day = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
        console.log(day);
        // Check if the provided date is a holiday-NOT DONE
        // const holidayCheckResult = await pool.query('SELECT * FROM Holidays WHERE date = ?', [date]);
        // //the first array will have result of date and next some primary key ka so checking of first ka 
        // if (holidayCheckResult[0].length != 0) {//the first in array will hold the date if 0 means not holiday
        //     // The selected day is a holiday
        //     return res.send({ message: "The selected day is a holiday" });

        // Retrieve doctors available for the provided department and day
        const doctors = await client.query(`SELECT d.doctor_id,d.name as doctor_name FROM opd_day as o NATURAL JOIN doctors as d WHERE o.opd_day = lower('${day}') AND d.department_name = '${department}'`);
        //db values are case sensitive so when querying them lower to all and use
    
        // Send the list of available doctors as response
        res.status(200).send({"available_doctors": doctors.rows});//list of available doctors as array of objects with the id and name(ID SO THAT CAN BE ACCESSED AND SEND LATER)
        
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
    finally{
        client.release();
    }
}

//once the doctor selected from the available doctors,show slots of it
async function appointmentSlots(req, res) {
    const client = await pool.connect();
    try {
        const docId = req.body.docID;//2 ids passed so id2
        const date = req.body.date;
        /*const slots = await pool.query('SELECT slot_no, slot_time FROM slot_details NATURAL JOIN slots WHERE doctor_id = ? AND date = ?', [docId, date]);
        console.log(slots);
        // here slots will be an array of objects with time and slot_no; total slots is 22
        let allSlots = await pool.query('SELECT slot_no FROM slots');
        console.log(allSlots);
        // allSlots has all slots
        let slotDetails = [];
        for (let i = 0; i < allSlots.length; i++) {
            let slotNo = allSlots[i].slot_no;
            if (slots[0].some(slot => slot.slot_no === slotNo)) {
                slotDetails.push({ [slotNo]: "booked" });
            } else {
                slotDetails.push({ [slotNo]: "not booked" });
            }
        }*/
        const slots = [1,2,3,4,5,6,7,8,9,10]//have 10 slots only
        // const availableSlotsQuery = `
        //     SELECT s.slot_no
        //     FROM slots s
        //     LEFT JOIN slot_details sd ON s.slot_no = sd.slot_no
        //                             AND sd.doctor_id = ?
        //                             AND sd.date = ?
        //     WHERE sd.slot_no IS NULL;
        // `;
        const booked_slots_result = await client.query(`select slot_no from appointments a where a.doctor_id = '${docId}' and a.date_of_appointment = '${date}' and a.status = 'pending'`);
        const booked_slots = booked_slots_result.rows.map(row => row.slot_no);
        console.log(booked_slots);
        const availableSlots = slots.filter(slot => !booked_slots.includes(slot));
        // const [availableSlotsRows, _] = await pool.query(availableSlotsQuery, [docId, date]);
        // const availableSlots = availableSlotsRows.map(row => row.slot_no);
        const responseData ={
            available_slots : availableSlots,
            slot_timings: slot_time
        }
        res.status(200).send(responseData);//will send only the available slots
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
    finally{
        client.release();
    }
}


//once the patient selects the doctora and slots shown and books the details stored in appointments and in the slot_details
async function bookAppointment(req, res) {
    const client = await pool.connect();
    try {
        // const patId = req.Patient_ID;
        const id = req.params.id;
        const { slot_no, date, reason_of_appointment,docID } = req.body;
        const day = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
        // Insert into appointments
        console.log(docID);
        // console.log(patId);
        //see to check for date,uska format and all
        await client.query(`INSERT INTO appointments (doctor_id, patient_id,date_of_appointment, slot_no, status, reason) VALUES ('${docID}','${id}','${date}','${slot_no}','pending','${reason_of_appointment}')`);
        
        // Insert into slot_details-NO SLOT DETAILS
        // await pool.query('INSERT INTO slot_details (slot_no, date, day, patient_id, doctor_id) VALUES (?, ?, ?, ?, ?)', [slot_no, date, day, patId, docId]);
        
        res.status(201).send({ message: 'Appointment booked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}



//eclinic section 
async function showDiseases(req,res){//to show all diseases to the users and also sends the disease ids for frontend
    const client = await pool.connect();
    try{
        const diseases = await client.query('Select disease_id,disease_name from diseases');
        const diseaseID = diseases.rows.map(disease => disease.disease_id);
        const diseaseArray = diseases.rows.map(disease => disease.disease_name);
        res.status(200).send({"diseases are" : diseaseArray,"disease ids are" : diseaseID});
    }catch(err){
        res.status(500).send({ error: 'Internal Server Error' });
        console.log(err);
    }
    finally{
        client.release();
    }
}
//the function takes the disease Id and then sends all the questions to that disease to be asked
async function getquestions(req,res){
    const client = await pool.connect();
    try{
        const {disease_id} = req.body;//in the params the id is used //disease id is number remember
        const questions = await client.query(`Select symptoms_questions from symptoms where disease_id = ${disease_id}`);
        console.log(questions);
        //so for that disease id send all the questions of that disease
        const questionArray = questions.rows.map(question => question.symptoms_questions);
        res.status(200).send({"questions are" : questionArray});
    }catch(err){
        res.status(500).send({ error: 'Internal Server Error' });
        console.log(err);
    }
    finally{
        client.release();
    }
}

//once the questions answered the answers are sent and recommendations are sent back
async function recommend(req,res){
    const client = await pool.connect();
    try{
        const {disease_id,answers} = req.body;
        //answers is array of answers with 1 and 0
        const severityresult = await client.query(`Select severity from diseases where disease_id = ${disease_id}`);
        const severity = severityresult.rows.map(severity => severity.severity)[0];//gets severity
        console.log(severity);
        const questions = await client.query(`Select symptoms_questions from symptoms where disease_id = ${disease_id}`);
        const disease = await client.query(`Select disease_name from diseases where disease_id = ${disease_id}`);
        const questionArray = questions.rows.map(question => question.symptoms_questions);
        // const expAnswers =  new Array(questionArray.length).fill(1);//for all questions ka 1 type array we do
        // const matchArray = [];
        //then based on severity of the disease we get the expected answers
        // if(severity>7 && severity<=10){
        //     for (let i = 0; i < answers.length; i++) {
        //         if (answers[i] === expAnswers[i]) {
        //             matchArray.push(1);
        //         }
        //     }
        //     const per = (matchArray.length / answers.length) * 100;
        //     if(per >= 20){
        //         res.status(200).send({"reccomendation":"better to consult a specialist"});
        //     }
        //     else{
        //         const genAItext = await takeCare(disease[0].map(disease => disease.Disease_Name)[0], questionArray, answers);
        //         res.status(200).send({"reccomendation":"take care at home","AItext":genAItext});
        //     }
        // }
        // else if(severity>4 && severity<=7)
        // {
        //     for (let i = 0; i < answers.length; i++) {
        //         if (answers[i] === expAnswers[i]) {
        //             matchArray.push(1);
        //         }
        //     }
        //     const per = (matchArray.length / answers.length) * 100;
        //     if(per >= 40){
        //         res.status(200).send({"reccomendation":"better to consult a specialist"});
        //     }
        //     else{
        //         const genAItext = await takeCare(disease[0].map(disease => disease.Disease_Name)[0], questionArray, answers);
        //         res.status(200).send({"reccomendation":"take care at home","AItext":genAItext});
        //     }
        // }
        // else if(severity>1 && severity<=4)
        // {
        //     for (let i = 0; i < answers.length; i++) {
        //         if (answers[i] === expAnswers[i]) {
        //             matchArray.push(1);
        //         }
        //     }
        //     const per = (matchArray.length / answers.length) * 100;
        //     if(per >= 60){
        //         res.status(200).send({"reccomendation":"better to consult a specialist"});
        //     }
        //     else{
        //         const genAItext = await takeCare(disease[0].map(disease => disease.Disease_Name)[0], questionArray, answers);
        //         res.status(200).send({"reccomendation":"take care at home","AItext":genAItext});
        //     }
        // }
        const genAItext = await takeCare(disease.rows.map(disease => disease.disease_name)[0], questionArray, answers,severity);
        res.status(200).send({"AItext":genAItext});
    }catch(err){
        console.log(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}


//doctors section 
async function getdoctorData(req, res) {//this is like in dashboard for doctor the details and view details on click on view details this will open for him
    const client = await pool.connect();
    try {
        const id = req.params.id; // Getting the doctor_id from the authenticated wala
        const doctor_details = await client.query(`select doctor_id,name,department_name,email,	license_number,age,phone,specialization,experience,awards,publications from doctors where doctor_id = '${id}'`);
        
        if (doctor_details.rows.length === 0) {//if no record then the query gives an empty array
            return res.status(404).send({ error: 'Doctor not found' });
        }
        //doctor can only see the doctor details all his details
        res.status(200).send({'doctor_details': doctor_details.rows[0]});
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
    finally{
        client.release();
    }
}
//register is only for doctors so not required of this 
//for doctor do
//when the doctor is new and enters the detials and posted
// async function adddoctorData(req, res) {//to do something missing ka hai like patid adding then inserting ka and all
//     try {
//         const patId = req.params.id;//new user shd be given a new pat id check how
//         const { patient_info, medical_history, tests } = req.body;
//         // Validate patient_info
//         const patientInfoKeys = ['first_name', 'last_name', 'gender', 'address', 'contact', 'email'];//age ka see once add that
//         if (!validateFields(patient_info, patientInfoKeys)) {
//             return res.status(400).send({ message: 'Missing or invalid fields in patient_info' });
//         }

//         // Validate medical_history
//         const medicalHistoryKeys = ['Diagnosis', 'Date_of_Diagnosis', 'Treatment_received', 'chronic_conditions'];
//         if (!validateFields(medical_history, medicalHistoryKeys)) {
//             return res.status(400).send({ message: 'Missing or invalid fields in medical_history' });
//         }

//         // Validate tests
//         const testsKeys = ['test_name', 'test_date', 'test_result'];
//         if (!validateFields(tests, testsKeys)) {
//             return res.status(400).send({ message: 'Missing or invalid fields in tests' });
//         }

//         // Insert data into respective tables
//         await pool.query('INSERT INTO patient_info SET ?', patient_info);
//         await pool.query('INSERT INTO medical_history SET ?', medical_history);
//         await pool.query('INSERT INTO patient_tests SET ?', tests);//set will tell to which columns which are in tests properties

//         res.status(201).send({ message: 'Patient data added successfully' });
//     } catch (err) {
//         console.error('Error:', err);
//         res.status(500).send({ error: 'Internal Server Error' });
//     }
//     /*
//     if the query ka error comes then to handle that (whenevr a error in query it comes as sqlmessage ka in th error object)
//     catch (err) {
//         console.error('Error:', err);
//         if (err.code === 'ER_DUP_ENTRY') { // Check for duplicate entry error(are codes of query error)
//             return res.status(400).send({ error: 'Duplicate entry error: This patient already exists' });
//         } else if (err.code === 'ER_NO_REFERENCED_ROW') { // Check for foreign key constraint violation
//             return res.status(400).send({ error: 'Foreign key constraint violation: Invalid reference' });
//         } else if (err.message.includes('your_constraint_name')) { // Check for specific constraint violation
//             return res.status(400).send({ error: 'Constraint violation: Your specific constraint message here' });
//         }
        
//         res.status(500).send({ error: 'Internal Server Error' });
//     }
//     */
// }

async function docdashboardSend(req, res) {
    const client = await pool.connect();
    try {
        const id = req.params.id;

        const appointmentsResult = await client.query(`SELECT appointment_id,p.patient_id,p.name as patient_name, a.Date_of_appointment, a.slot_no,a.reason FROM appointments a JOIN patients p ON a.patient_id = p.patient_id WHERE doctor_id = '${id}' AND status = 'pending'`);//get all details of pending appointments of the doctor

        const appointmentIdentify = await client.query(`SELECT appointment_id,doctor_id,patient_id FROM appointments WHERE doctor_id = '${id}' AND status = 'pending'`);
        const responseData = {
            appointments: appointmentsResult.rows.length > 0 ? appointmentsResult.rows : null,//null so client can see if null then tell no appointments like that 
            IDs: appointmentIdentify.rows.length > 0 ? (appointmentIdentify.rows) : null,
            slot_timings : slot_time
        };

        res.status(200).send(responseData); // sends the response as json as( responseData is object )
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
    finally{
        client.release();
    }
}

//whenever a appointment is clicked by doctor the appointmentId,doc_id,Pat_id is there and when he clicks on view details of patient this will be called to get the patient data of that appointment
async function getdocpatientData(req, res) {
    const client = await pool.connect();
    try {
        const id = req.params.id;
        // const {appointment_id,doctor_id,patient_id}= req.body;//get the details to uniquely identify the appointment even though here only patid is enough but all for unique identification of the appointmentID
        // const {patient_id}= req.body;//get the details to uniquely identify the appointment even though here only patid is enough but all for unique identification of the appointmentID
        // const patient_id = await pool.query('Select Patient_ID FROM appointment WHERE ID = ?', [appointmentID]);
        // const id = patient_id[0].map(patient_id => patient_id.Patient_ID) // Getting the patient_id from the appointments
        // const patient_info = await pool.query('SELECT * FROM patient_info WHERE patient_id = ?', [id]);
        // const medical_history = await pool.query('SELECT * FROM medical_history WHERE patient_id = ?', [id]);
        // //doctor show the tests(doctor recommended and patient all tests shown)
        // const doc_tests = await pool.query('SELECT * FROM doc_pat_tests WHERE patient_id = ?', [id]);

        // if (patient_info.length === 0) {//if no record then the query gives an empty array
        //     return res.status(404).send({ error: 'Patient not found' });
        // }

        // const responseData = {
        //     patient_info: patient_info[0], // Assuming patient_info has only one record
        //     medical_history: medical_history.length > 0 ? medical_history[0] : null,
        //     tests: doc_tests.length > 0 ? doc_tests[0] : null
        // };

        // res.status(200).send(responseData);
        const patient_info = await client.query(`SELECT patient_id,name,gender,contact,address,email FROM patients WHERE patient_id = '${id}'`);
        const medical_history = await client.query(`SELECT patient_id,diagnosis,date_of_diagnosis,treatment_given,family_history FROM medical_history WHERE patient_id = '${id}'`);
        //having two doctor recommended test and patient tests
        // const doc_tests = await client.query(`select t.test_name,t.recommendation_date,d.name as doctor_name from tests_recommended as t join doctors as d on t.doctor_ID = d.doctor_id where t.patient_id = '${id}'`);
        const pat_tests = await pool.query(`select test_name,result,date_taken from tests_taken where patient_id = '${id}'`);
        const doctor_recommended_tests = await client.query(`SELECT t.test_name, d.name as doctor_name,t.result as test_result  FROM tests_recommended t JOIN doctors d ON t.doctor_ID = d.doctor_id WHERE t.patient_id = '${id}'`);

        if (patient_info.rows.length === 0) {//if no record then the query gives an empty array
            return res.status(404).send({ error: 'Patient not found' });
        }

        const responseData = {
            patient_info: patient_info.rows[0], // Assuming patient_info has only one record
            medical_history: medical_history.rows.length > 0 ? medical_history.rows[0] : null,
            // doctor_recommended_tests: doc_tests.rows.length > 0 ? doc_tests.rows[0] : null,
            patient_taken_tests: pat_tests.rows.length > 0 ? pat_tests.rows : null,
            doctor_recommended_tests: doctor_recommended_tests.rows.length > 0 ? doctor_recommended_tests.rows[0] : null
        };

        res.status(200).send(responseData);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
    finally{
        client.release();
    }
}


//a post request when the doctor prescribes something to the user
async function docPrescribe(req,res){
    const client = await pool.connect();
    try{
        const {appointment_id,doctor_id,patient_id}= req.body;
        // const docId = req.Doctor_ID;
        // const appointmentID = req.params.appointmentID;//get the appointmnt id from the route param
        // const patient_id = await pool.query('Select Patient_ID FROM appointment WHERE ID = ?', [appointmentID]);
        // const id = patient_id[0].map(patient_id => patient_id.Patient_ID) // Getting the patient_id from the appointments
        const {medication_name, dosage, frequency} = req.body;
        const response = await client.query(`INSERT INTO prescriptions(doctor_id,patient_id,medication_name,dosage,frequency,appointment_id) Values ('${doctor_id}','${patient_id}','${medication_name}','${dosage}','${frequency}','${appointment_id}')`);
        // await pool.query('UPDATE prescription_table SET Prescription_ID = (SELECT COALESCE(MAX(Prescription_ID),0) + 1 FROM prescription_table) WHERE Prescription_ID = LAST_INSERT_ID();');

        //so that when updated,inserted only then add if something wrong dont add 
        if(response.rowCount === 0){
            return res.status(404).send({error:'Error while adding prescription'});
        }
        res.status(200).send({message:'Prescription added successfully'});
    }catch(err){
        console.log(err);
        res.status(500).send({error:'Internal Server Error'});
    }
    finally{
        client.release();
    }
}

//when doctor prescribes the test to the patient
async function docTest(req,res){
    const client = await pool.connect();
    try{
        const {appointment_id,doctor_id,patient_id}= req.body;
        // const docId = req.Doctor_ID;
        // const appointmentID = req.params.appointmentID;//get the appointmnt id from the route param
        // const patient_id = await pool.query('Select Patient_ID FROM appointment WHERE ID = ?', [appointmentID]);
        // const id = patient_id[0].map(patient_id => patient_id.Patient_ID)
        const {test_name} = req.body;//the doctor sends name of test to be taken
        await client.query(`INSERT INTO tests_recommended(doctor_id,patient_id,test_name,recommendation_date) VALUES('${doctor_id}','${patient_id}','${test_name}',CURRENT_DATE)`);//store in test as recommended by doctor
        res.status(200).send({message:'Test added successfully'});

    }catch(err){
        console.log(err);
        res.status(500).send({error:'Internal Server Error'});
    }
    finally{
        client.release();
    }
}

//once the appointment is done the doctor can change the status like click on done then the appointment comes as done in the dashboard wont show for both as pending is used
async function docAppointmentStatus(req,res){
    const client = await pool.connect();
    try{
        const {appointment_id,doctor_id,patient_id}= req.body;//get the appointmnt id from the route param
        await client.query(`UPDATE appointments SET Status = 'done'  WHERE appointment_id= '${appointment_id}' and doctor_id = '${doctor_id}' and patient_id = '${patient_id}'`);//update the status of the appointment`);   
        res.status(200).send({message:'Appointment status changed successfully'});
    }catch(err){
        console.log(err);
        res.status(500).send({error:'Internal Server Error'});
    }
    finally{
        client.release();
    }
}
// module.exports = { docusers,docpassword,doctor_id,patient_id,patusers,patpassword,getpatientData, addpatientData, dashboardSend,availableDoctors,appointmentSlots,bookAppointment,getquestions,recommend,adddoctorData,getdoctorData,docdashboardSend,getdocpatientData,docPrescribe,docTest,docAppointmentStatus,showDiseases,test};

module.exports = { docusers,docpassword,doctor_id,patient_id,patusers,patpassword,getpatientData, addpatientData, dashboardSend,availableDoctors,appointmentSlots,bookAppointment,getquestions,recommend,getdoctorData,docdashboardSend,getdocpatientData,docPrescribe,docTest,docAppointmentStatus,showDiseases,dashboardPrescription,test,dashboardSendold};