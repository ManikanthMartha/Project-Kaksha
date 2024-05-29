const express = require('express');
const db = require('../db/db');

const eclinicRouter = express.Router({mergeParams:true});

eclinicRouter.route('/')//whenever a eclinic section is entered all the diseases available has to be shown to him and disease ids are sent to frontend for future use of acccessing the diseases
.get(db.showDiseases);
eclinicRouter.route('/survey')//the disease id is selected and passed in body and shd send all the questions to of the disease
.get(db.getquestions);

eclinicRouter.route('/recommend')//for this the disease id and answers array in the body is passed
.get(db.recommend);
//the answer array we will keep it to be in 1 0 1 0 form if yes for that question then 1 is sent if no then 0 is sent
module.exports = eclinicRouter;