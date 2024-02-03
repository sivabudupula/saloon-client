const Register = require('../models/RegisterModel');
const jwt = require('jsonwebtoken');

exports.CreateLogin=async (req, res) => {
    try{
        const {username,password} = req.body;
        let exist = await Register.findOne({username});
        if(!exist) {
          return res.status(400).json({ error: 'User Not Found' });
  
        }
        if(exist.password !== password) {
          return res.status(400).json({ error: 'Invalid Credentials' });
  
        }
        let payload = {
            user:{
                id : exist.id
            }
        }
        jwt.sign(payload,'jwtSecret',{expiresIn:3600000},
          (err,token) =>{
              if (err) throw err;
              // return res.json({token})
              return res.status(200).json({
                token,
                message: 'Login Successful'
              });
          }  
            )
  
    }
    catch(err){
        console.log(err);
        return res.status(500).send('Server Error')
    }
  }
  
  
  