const express = require('express');
const db = require('../db/db');

const doctorRouter = express.Router();

doctorRouter.route('/:id')//when at doctors/id the detials of doctor is shown
.get(db.getdoctorData)//working

    
doctorRouter.route('/dashboard/:id')//route for doctor dashboard will have appointments and to see his details
.get(db.docdashboardSend);//sending appointments of that doctor(WORKING) allong with the identification(appointmentID,docID,patId)as combi of this uniquely identify the appointment(so docID ins barer and each appointmentID will be sent and patID in the appointment only will be send so all this will have to be send from the front end when referring a appointment)

//so when the doctor clicks on a specific appointment the front end sends that appointmentID.
//when clicked on appointment frontend shd show the patient name(sent to the frontend with the dashboard appointments) so shd shd patient name ,option for detials,prescribe medications,prescribe tests
//will send patient name,option to view pattient details,

doctorRouter.route('/appointment/details/:id')//appointment id,doc id,patient id is to be passed by the frontend in body
//shd give the patient details on clicking on the view details
.get(db.getdocpatientData);//will give the patient details as detials,medical history,tests taken
//(TO DO is to see adding doctor tests also)
//done of getting patient detials except for showing the doctor tests

doctorRouter.route('/appointment/prescribe/:pid/:did')//prescribing the medications
//appointment id,doc id,patient id is to be passed by the frontend in body
//the body should have Medication_Name, Dosage, Frequency(in frontend options to enter)
.post(db.docPrescribe);//new prescription added ka done

doctorRouter.route('/appointment/prescribetests')//appointment id,doc id,patient id is to be passed by the frontend in body
//telling what tests to take by doctor goes to doctor tests where the test is store as pending and shown in patient dashboard that it is pending and to be taken the patient_tests comes as the tests he has taken and in his details
.post(db.docTest);//the body will have the test name in it given by the doctor

doctorRouter.route('/appointment/status')//whenever closed(like status is clicked like button in frontend) so no body req only then so
.post(db.docAppointmentStatus);//when done to change status of appointment to done
//shd change the slots and all the things shd be done
//when this done the appointment status changed to pending


module.exports = doctorRouter;