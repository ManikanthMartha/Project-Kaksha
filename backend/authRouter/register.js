const db = require('../db/db');
//when registering the form shd have basic details to be entered name,gender,contact,address,email,password

//shd send in the body three in json like personal_info,medical_history,tests_taken
/*{
    personal_info  {
        ..all of the details for the patient table
    },
    medical_history :{
        ..all of the details for the medical history table
    },
    tests_taken : {
        ..all of the details for the tests taken table
        //if multiple then it is a array like [{},{},{}] of objects

    }
sample is 
{
    "personal_info": {
        "name": "Keerthan Kumar C",
        "gender": "Male",
        "age": 25,
        "contact": "1234567890",
        "address": "123 Main St, City",
        "email": "keer@example.com",
        "password": "password@123"
    },
    "medical_history": {
        "diagnosis": "Hypertension",
        "date_of_diagnosis": "2023-01-15",
        "treatment_given": "Prescribed medication",
        "family_history": "No significant family history"
    },
    "tests_taken": [
        {
        "test_name": "Blood Pressure",
        "result": "Normal",
        "date_taken": "2023-01-15"
        },
        {
        "test_name": "Cholesterol",
        "result": "Normal",
        "date_taken": "2023-01-15"
        }
    ]
}
*/ 
//all the fields to be required shd be checked by the frontend
async function register(req, res) {
    const {personal_info,medical_history,tests_taken} = req.body;
    if ( !personal_info || !medical_history || !tests_taken) {
        return res.status(400).send({error: 'All fields are required'});
    }
    const email = personal_info.email;
    console.log(email);
    const email_check = await check_email(email);
    if (email_check) {
        return res.status(400).send({error: 'Email already exist'});
    }
    //if email proper and has all fields are there 
    // const personal_array = Object.values(personal_info);
    // const medical_array = Object.values(medical_history);
    // const test_array = Object.values(tests_taken);
    // console.log(personal_array,medical_array,test_array);
    const result = await db.addpatientData(personal_info,medical_history,tests_taken);
    if(result === false){
        return res.status(400).send({error: 'Something went wrong'});
    }
    res.status(201).send({message: 'Patient registered successfully'});//then go to login redirect by frontend
}
//check if the email already exist in the database and cant use that email
async function check_email(email){
    const email_got = await db.patusers(email);
    console.log('email got ',email_got);
    if(email_got === null){
        return false;
    }
    else{
        return true;
    }
}
module.exports = {register}