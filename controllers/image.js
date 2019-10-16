const Clarifai =  require('clarifai');
const app = new Clarifai.App({
    apiKey: 'e7d73ad0648d404798bafcb6651ca693'
  });

  const handleApiCall = (request, response)=>{
    app.models.predict(Clarifai.FACE_DETECT_MODEL, request.body.input)
    .then(data=>response.json(data))
    .catch(err=>response.status(400).json(`unable to work with API ${err}`))


  }
const handleImagePut = (request, response,dataBase) => {
    const {id} = request.body;
    dataBase('users').where('id', '=', id) //Knex syntax from documentation
        .increment('entries', 1)
        .returning('entries')
        .then(entries => response.json(entries))
        .catch(err => console.log(response.status(400).json('Unable to get entries')));
}

module.exports ={
    handleImagePut:handleImagePut,
    handleApiCall:handleApiCall
}

