
const handleImagePut = (request, response,dataBase) => {
    const {id} = request.body;
    dataBase('users').where('id', '=', id) //Knex syntax from documentation
        .increment('entries', 1)
        .returning('entries')
        .then(entries => response.json(entries))
        .catch(err => console.log(response.status(400).json('Unable to get entries')));
}

module.exports ={
    handleImagePut:handleImagePut
}

