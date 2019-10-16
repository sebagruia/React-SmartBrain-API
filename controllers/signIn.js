
const handleSignInPost = (request, response, dataBase, bcrypt) => {
    const {email, password} =request.body;
    if(!email || !password){
        return response.status(400).json('Incorrect form submission');
    }
    dataBase.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data=>{
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if(isValid){
          return dataBase.select('*').from('users')
          .where('email', '=', email)
          .then(user=>{
              console.log(user);
              response.json(user[0])})
          .catch(err=>{
              response.status(400).json('unable to get user');
          })
      }else{
          return response.json('Password - Username cobination not matching');
      }
          
      
    })
    .catch(err=>response.status(400).json('wrong credentials'));
  
  }

  module.exports ={
      handleSignInPost:handleSignInPost
  };