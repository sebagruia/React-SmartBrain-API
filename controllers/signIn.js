
const handleSignInPost = (request, response, dataBase, bcrypt) => {
    dataBase.select('email', 'hash').from('login')
    .where('email', '=', request.body.email)
    .then(data=>{
      const isValid = bcrypt.compareSync(request.body.password, data[0].hash);
      if(isValid){
          return dataBase.select('*').from('users')
          .where('email', '=', request.body.email)
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