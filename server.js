const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// For the "bcrypt" library
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 'apples';
const someOtherPlaintextPassword = 'not_bacon';
// ---------------------------------------------

const app = express();

app.use(cors());
app.use(bodyParser.json());
const dataBase = {
    users: [{
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }

    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'

        }

    ]
};




app.get('/', (request, response) => {
    response.json(dataBase.users);
});

app.post('/signIn', (request, response) => {
    // Load hash from your password DB.
    bcrypt.compare(myPlaintextPassword, '$2b$10$xN/crNWviURulsMCIsIJjO.raLedmvYkST5ULcXrtHppXYUKNtCbK', function (err, res) {
        // res == true
        console.log('first quess', res);
    });
    bcrypt.compare(someOtherPlaintextPassword, '$2b$10$xN/crNWviURulsMCIsIJjO.raLedmvYkST5ULcXrtHppXYUKNtCbK', function (err, res) {
        // res == false
        console.log('second quess', res);
    });
    // response.send('SignIn response working'); This can be also used but express comes with a better method -> json()
    if (request.body.email === dataBase.users[0].email && request.body.password === dataBase.users[0].password) {
        response.json(dataBase.users[0])
    } else {
        response.status(400).json('Error logging in');
    }

})

app.post('/register', (request, response) => {
    const {
        email,
        password,
        name
        } = request.body;
    bcrypt.hash(password, saltRounds, function (err, hash) {
        // Store hash in your password DB.
        console.log(hash);
    });
    dataBase.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    });

    response.json(dataBase.users[dataBase.users.length - 1]);
});

app.get('/profile/:id', (request, response) => {
    const {
        id
    } = request.params;
    let found = false;
    dataBase.users.forEach((user) => {
        if (user.id === id) {
            found = true;
            return response.json(user);
        }
    });
    if (!found) {
        response.status(400).json('No such User');
    }
});

app.put('/image', (request, response) => {
    const {
        id
    } = request.body;
    let found = false;
    dataBase.users.forEach((user) => {
        if (user.id === id) {
            user.entries++;
            found = true;
            return response.json(user.entries);
        }
    });
    if (!found) {
        response.status(400).json('No such User');
    }

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