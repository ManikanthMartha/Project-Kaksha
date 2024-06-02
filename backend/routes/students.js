const express = require('express');
const { getStudentData, getCourseModules } = require('../db/db');

const studentRouter = express.Router();

studentRouter.route('/studentdata/:id')//when at patients/id 
.get(getStudentData)

studentRouter.route('/modules/:courseId')
.get(getCourseModules);
    

module.exports = studentRouter;