const handleRegisterPost = (request, response, dataBase, bcrypt) => {
const saltRounds = 10;
    const {email,password,name} = request.body;
    if(!email || !name || !password){
        return response.status(400).json('Incorrect form submission');
    }
    const hash = bcrypt.hashSync(password, saltRounds);

    //This is the way to add new user when we don't use a DataBase bot only a variable that holds all our users
    // dataBase.users.push({
    //     id: '125',
    //     name: name,
    //     email: email,
    //     password: password,
    //     entries: 0,
    //     joined: new Date()
    // });

    dataBase.transaction(trx => { // transaction() is a method from Knex library and it makes sure both tables: users and login are updated, if one fails then the whole transaction fails
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(logInEmail => {
                return trx.insert({
                    email: logInEmail[0],
                    name: name,
                    time: new Date()

                })
                    .into('users')
                    .returning('*') // returning('*') -> is a method from Knex that allows us to return all columns
                    .then(user => {
                        response.json(user[0]);

                    })
            })
            .then(trx.commit)
            .catch(trx.rollback);

    }) // transaction(trx) -> is a method from Knex 
        // return dataBase('users')
        // .returning('*')
        // .insert({  // returning('*') -> is a method from Knex that allows us to return all columns
        //     email: email,
        //     name: name,
        //     time: new Date()

        // }).then(user => {
        //     response.json(user[0]);

        // })
        .catch(err => {
            response.status(400).json('Unable to register');
        });

    };

    module.exports = {
        handleRegisterPost: handleRegisterPost
    };
