const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


// For the "Knex" library - it connects the database to the server
const knex = require('knex');
// Importing Controllers
const register = require('./controllers/register');
const signIn = require('./controllers/signIn');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

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
// ---------------------------------------------

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (request, response) => {
    response.json(dataBase.users);
});

app.post('/signIn', (request,response)=>{signIn.handleSignInPost(request,response,dataBase,bcrypt)}); // here we are injecting in this function the dependencies dataBase and bcrypt insetead of just import them in the controller itself

app.post('/register',(request, response)=>{register.handleRegisterPost(request,response,dataBase, bcrypt)} );

app.get('/profile/:id', (request, response)=>{profile.handleProfileGet(request,response,dataBase)} );

app.put('/image',(request, response)=>{image.handleImagePut(request,response,dataBase)});

app.post('/imageUrl',(request, response)=>{image.handleApiCall(request,response)} );


app.listen(process.env.PORT || 3000, () => { //process.env.PORT - is ecessary for Heroku, because it uses a random Port
    console.log(`app si running on port ${process.env.PORT}`);
});

/*
    - response = this is working
    - /sing in --> POST (because we add the user info on server) and we expect a ==> succes/fail response
    - /register --> POST (because we add the user info on server) ==> will return the new USER object
    - /profile/:userID ==> GET user
    - /image ==> PUT (everytime the user uploads an image the rank of the user is affected) will retrieve the updated USER

*/