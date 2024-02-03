const Register = require('../models/RegisterModel');

exports.CreateRegister = async (req, res) =>{
    try{
        const {username,email,password,confirmpassword} = req.body;
        let exist = await Register.findOne({username})
        if (exist) {
          return res.status(400).json({ error: 'User Already Exist' });
      }   
      
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.'
    });
  }
        if(password !== confirmpassword){
            return res.status(400).json({ error: 'Passwords are not matching' });
  
        
        }
        let newUser = new Register({
            username,
            email,
            password,
            confirmpassword
        })
        await newUser.save();
        res.status(200).json({message:'Registered Successfully'});
  
    }
    catch(err){
        console.log(err)
        return res.status(500).json({error:'Internel Server Error'})
    }
  }
  
  
  exports.ReadRegister = async (req, res) =>{

  try{
    let exist = await Register.findById(req.user.id);
    if(!exist){
        return res.status(400).send('User not found');
    }
    res.json(exist);
}
catch(err){
    console.log(err);
    return res.status(500).send('Server Error')
}
  }


  exports.UpdateRegister= async (req, res) => {
    const  id  = req.params.id;
    try {
      const updatedUser = await Register.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found.' });
      }
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while updating the user.' });
    }
  };