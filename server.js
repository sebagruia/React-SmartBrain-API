const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// For the "Knex" library - it connects the database to the server
const knex = require('knex');

const dataBase = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres', // for Windows the "user" = "postgres" 
        password: 'test123', // for Windows the "password" = "the password that was set when installing postgress" 
        database: 'smartBrain'
    }
});

dataBase.select('*').from('users').then(data => { //Knex creates a Promise, so we can use "then()"
    console.log(data);

});


// For the "bcrypt" library - for encrypting the password
const bcrypt = require('bcrypt');
const saltRounds = 10;
// ---------------------------------------------

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (request, response) => {
    response.json(dataBase.users);
});

app.post('/signIn', (request, response) => {
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

})

app.post('/register', (request, response) => {
    const {
        email,
        password,
        name
    } = request.body;
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

});

app.get('/profile/:id', (request, response) => {
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
});


app.put('/image', (request, response) => {
    const {id} = request.body;
    dataBase('users').where('id', '=', id) //Knex syntax from documentation
        .increment('entries', 1)
        .returning('entries')
        .then(entries => response.json(entries))
        .catch(err => console.log(response.status(400).json('Unable to get entries')));
});


app.listen(3000, () => {
    console.log('app si running on port 3000');
});

/*
    - response = this is working
    - /sing in --> POST (because we add the user info on server) and we expect a ==> succes/fail response
    - /register --> POST (because we add the user info on server) ==> will return the new USER object
    - /profile/:userID ==> GET user
    - /image ==> PUT (everytime the user uploads an image the rank of the user is affected) will retrieve the updated USER

*/