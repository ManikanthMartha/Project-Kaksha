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


async function studusers(email) {
    const client = await pool.connect();
    console.log(email);
    try {
        //seeing if for that role that username exists
        //const result  = await pool.query('SELECT email FROM students_login WHERE email=?', [email]);
        const result = await client.query(`select email from students where email='${email}'`);//do this instead of ? and also email is string so ' ' has to be there
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
async function studpassword(email){
    const client = await pool.connect();
    try{
        //get password object
        const result = await client.query(`SELECT password_hash FROM students WHERE email = '${email}'`);
        const pass = result.rows.map(pass => pass.password_hash);
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
//returning the student_id based on username
async function student_id(email){
    const client = await pool.connect();
    try{
        const result = await client.query(`select student_id from students where email = '${email}'`);
        student_id = result.rows.map(student_id => student_id.student_id);
        console.log(student_id);
        return student_id[0];
    }catch(err){
        console.log(err);
        throw err;
    }
    finally{
        client.release();
    }
}

//returning the student details from the database
async function getStudentData(req, res) {
    console.log(req.params.id);
    const client = await pool.connect();
    try {
        const id = req.params.id; // Getting the student_id from the authenticated request
        
        const studentQuery = client.query(`SELECT student_id, username, first_name, last_name, email FROM Students WHERE student_id = $1`, [id]);
        const enrolledCoursesQuery = client.query(`SELECT c.course_id, c.course_name, c.description FROM Courses c
                                                   JOIN Enrollments e ON c.course_id = e.course_id
                                                   WHERE e.student_id = $1`, [id]);

        const [student_info, enrolled_courses] = await Promise.all([studentQuery, enrolledCoursesQuery]);

        if (student_info.rows.length === 0) { // If no record then the query gives an empty array
            return res.status(404).send({ error: 'Student not found' });
        }

        const courseIds = enrolled_courses.rows.map(course => course.course_id);
        
        let course_modules = {};
        if (courseIds.length > 0) {
            const modulesQuery = await client.query(`SELECT cm.course_id, m.module_id, m.module_name, m.description FROM Modules m
                                                     JOIN CourseModules cm ON m.module_id = cm.module_id
                                                     WHERE cm.course_id = ANY($1::int[])`, [courseIds]);
                                                     
            course_modules = modulesQuery.rows.reduce((acc, module) => {
                if (!acc[module.course_id]) {
                    acc[module.course_id] = [];
                }
                acc[module.course_id].push(module);
                return acc;
            }, {});
        }

        const responseData = {
            student_info: student_info.rows[0], // Assuming student_info has only one record
            enrolled_courses: enrolled_courses.rows.length > 0 ? enrolled_courses.rows : null,
            course_modules: Object.keys(course_modules).length > 0 ? course_modules : null
        };

        res.status(200).json(responseData);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
}

async function getCourseModules(req, res) {
    const client = await pool.connect();
    try {
        const courseId = req.params.courseId; // Assuming course_id is passed as a URL parameter

        // Fetch modules for the course
        const modulesQuery = `
            SELECT m.module_id, m.module_name, m.description, m.pdfurl 
            FROM Modules m
            JOIN CourseModules cm ON m.module_id = cm.module_id
            WHERE cm.course_id = $1
        `;
        const modulesResult = await client.query(modulesQuery, [courseId]);

        if (modulesResult.rows.length === 0) {
            return res.status(404).send({ error: 'No modules found for the course' });
        }

        res.status(200).json(modulesResult.rows);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
}

async function getCourse(req,res) {
    const client = await pool.connect();
    try {
        const courseId = req.params.courseId;
        const queryText = 'SELECT course_name FROM courses WHERE course_id = $1';
        const result = await client.query(queryText, [courseId]);
        if (result.rows.length === 0) {
            res.status(404).send({ error: 'Course not found' });
        } else {
            const courseName = result.rows[0].course_name;
            res.status(200).send({ courseName });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
}

module.exports = { studusers, studpassword, student_id, getStudentData, getCourseModules, getCourse };