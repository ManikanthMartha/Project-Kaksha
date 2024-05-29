const db = require('../db/db');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

require('dotenv').config();
async function login(req,res){
    try{
        const{ email, password, role }=req.body;

        if(!email || !password || !role ){
            res.status(400).send({message:"All fields are required"});
            return;
        }

        if(role==='doctor'){
            const user = await db.docusers(email);
            console.log(user);
            if(!user){
                res.status(401).send({message:"Invalid Email Address(User doesnt Exist)"});
                return;
            }
            
            const pass = await db.docpassword(email); 
            
            if(pass === password){
                const id = await db.doctor_id(email);
                generateTokenandSetCookie(id, role, res);
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
        }
        
        else if(role === "patient"){
            const user = await db.patusers(email);

            if(!user){
                res.status(401).send({message:"Invalid Email Address(User doesnt Exist)"});
                return;
            }
            
            const pass = await db.patpassword(email);
            
            if(pass === password){
                const id = await db.patient_id(email);
                generateTokenandSetCookie(id, role, res);
                res.status(200).json({
                    message:"Login Successful",
                    // token:create_jwt(patient_id,role,res),patient_id
                    id
                });
                return;
            }
            else{
                res.status(401).send({message:"Invalid Password"});
            }
        }
    }catch(err){
        console.log(err);
    }
}

function generateTokenandSetCookie (id, role, res)  {
    const token =  jwt.sign({ id, role }, process.env.JWT_SECRET_KEY, {
        expiresIn: '2h',
    });

    res.cookie('jwt', token,{
        maxAge: 2 * 60 * 60 * 1000,
        httpOnly: true,
    });
    return token;
};


module.exports = {login};