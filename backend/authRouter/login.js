const db = require('../db/db');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

require('dotenv').config();
async function login(req,res){
    try{
        const{ email, password }=req.body;

        if(!email || !password ){
            res.status(400).send({message:"All fields are required"});
            return;
        }

            const user = await db.studusers(email);
            console.log(user);
            if(!user){
                res.status(401).send({message:"Invalid Email Address(User doesnt Exist)"});
                return;
            }
            
            const pass = await db.studpassword(email); 
            
            if(pass === password){
                const id = await db.student_id(email);
                generateTokenandSetCookie(id, res);
                res.status(200).json({
                    message:"Login Successful",
                    // token:create_jwt(doctor_id,role),
                    id
                });
                return ;
            }
            else{
                res.status(401).json({message:"Invalid Password"});
            }
        

    }catch(err){
        console.log(err);
    }
}

function generateTokenandSetCookie (id, res)  {
    const token =  jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
        expiresIn: '2h',
    });

    res.cookie('jwt', token,{
        maxAge: 2 * 60 * 60 * 1000,
        httpOnly: true,
    });
    return token;
};


module.exports = {login};