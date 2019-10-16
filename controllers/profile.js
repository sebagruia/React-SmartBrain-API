const handleProfileGet = (request, response, dataBase) => {
    const {id} = request.params;

    dataBase.select('*').from('users').where({id: id})
        .then(user => {
            if (user.length) { // 
                response.json(user[0]);
            } else {
                response.status(400).json('Not Found');
            }
        })
        .catch(err => {
            response.status(400).json('error getting user');
        });
}

module.exports ={
    handleProfileGet:handleProfileGet
}