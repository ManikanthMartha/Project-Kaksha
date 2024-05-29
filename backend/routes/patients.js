const express = require('express');
const { getpatientData, addpatientData, dashboardSend, dashboardSendold, availableDoctors,appointmentSlots,bookAppointment, dashboardPrescription} = require('../db/db');

const eclinicRouter = require('./eclinic');
const patientRouter = express.Router();


patientRouter.route('/patientdata/:id')//when at patients/id 
.get(getpatientData)
// .post(addpatientData);//when the new patient ka data is posted
    
patientRouter.route('/dashboard/:id')//route for patient dashboard 
.get(dashboardSend);//sending upcoming appointments,prescriptions,tests and will have view details

patientRouter.route('/old/dashboard/:id')//route for patient dashboard 
.get(dashboardSendold);

patientRouter.route('/prescription/:id')
.get(dashboardPrescription);

// patientRouter.route('/appointments').get(availableDoctors);//appointments se doctors send
patientRouter.route('/availabledoctors').get(availableDoctors);//appointments se doctors send

patientRouter.route('/bookappointments/:id')
.get(appointmentSlots)//when id is passed of doctor in body the slots of his which  is booked and not booked is send to him and shd display only available slots for the patient
.post(bookAppointment);//when patient id is passed as post request to book appointment

//when a request to /patient/eclinic is made the eclinic router is used
patientRouter.use('/eclinic',eclinicRouter);


module.exports = patientRouter;