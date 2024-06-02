const express = require('express');
const { getStudentData, getCourseModules, getCourse } = require('../db/db');

const studentRouter = express.Router();

studentRouter.route('/studentdata/:id')//when at patients/id 
.get(getStudentData)

studentRouter.route('/course/:courseId')
.get(getCourse);

studentRouter.route('/modules/:courseId')
.get(getCourseModules);
    

module.exports = studentRouter;