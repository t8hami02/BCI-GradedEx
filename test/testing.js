const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const users = require('../services/users');
const posts = require('../services/posts');
const { v4: uuidv4 } = require('uuid');

const expect = chai.expect;
const apiAddress = 'http://localhost:3000';

describe('Testing all the operations', function () {

    before(function () {
        server.start();
    });

    after(function () {
        server.stop();
    });

    describe('login', function () {
        it('should login with user:user123 and password:myPassword', async function () {
            await chai.request(apiAddress)
            .post('/login')
            .auth("user123", "myPassword")
            .then(response => {

                console.log(response);
                expect(response.status).to.equal(200);
            })
        });
    });

    describe('Selling post operations', function () {

        describe('Add a new post', function(){
            it('should add a post', async function(){
                await chai.request(apiAddress)
                .post('/posts')
                .auth("user123", "myPassword")
                .send({
                    postId: uuidv4(),
                    title: 'Old table',
                    description: 'Some description',
                    category: 'furniture',
                    location: 'Somestreet 12, 90100, Oulu, Finland',
                    image: 'Some image',
                    price: '50e',
                    deliveryType:{
                        shipping: false,
                        pickup: true
                    },
                    sellerName: 'Joe Doe',
                    sellerContactInfo: 'a.a@something.net',
                    postDate: '10-10-2020'
                })
                .then(response => {
                    expect(response.status).to.equal(201);
                    return chai.request(apiAddress).get('/posts/'+ posts.getPostIdByTitle('Old table'))
                    .auth("user123", "myPassword")
                })
                .then(readResponse => {
                    expect(readResponse.status).to.equal(200);
                    expect(readResponse.body.title).to.equal("Old table");
                    expect(readResponse.body.category).to.equal("furniture");
                })
                .catch(error => {
                    expect.fail(error);
                })
            })
        });

        describe('Edit a users selling post', function(){
            it('should edit user123 post of Vintage Lamp description to "this is a description"', async function(){
                await chai.request(apiAddress)
                .put('/posts/' + posts.getPostIdByTitle('Old table'))
                .auth("user123", "myPassword")
                .send({
                    description: 'this is a description'
                })
                .then(response => {
                    expect(response.status).to.equal(200);
                    return chai.request(apiAddress).get('/posts/' + posts.getPostIdByTitle('Old table'))
                    .auth("user123", "myPassword")
                })
                .then(readResponse => {
                    expect(readResponse.status).to.equal(200);
                    expect(readResponse.body.description).to.equal("this is a description");
                })
                .catch(error => {
                    expect.fail(error);
                })
            })
        });

        describe('delete a selling post', function(){
            it('should delete user222 selling post of old car', async function(){
    
                postId = posts.getPostIdByTitle('Old car');
    
                await chai.request(apiAddress)
                .delete('/posts/' + postId)
                .auth("user222", "myPassword")
                .then(response => {
                    expect(response.status).to.equal(200);
                    return chai.request(apiAddress).get('/posts/'+ postId)
                })
                .then(readResponse => {
                    expect(readResponse.status).to.equal(404);
                })
                .catch(error => {
                    expect.fail(error);
                })
            })
        });

    });

    describe('User operations', function () {      
    
        describe('Get specific user', function () {
    
            it('should respond with an json array of the user123 user info', async function () {
    
                console.log(users.getUserId('user123'));
    
                await chai.request(apiAddress)
                .get('/users/'+ users.getUserId('user123'))
                .auth("user123", "myPassword")
                .then(response => {
    
                    console.log(response);
                    expect(response.status).to.equal(200);
                    expect(response.body).to.be.a('object');
                    expect(response.body).to.have.a.property('userId');
                    expect(response.body).to.have.a.property('username');
                    expect(response.body).to.have.a.property('name');
                    expect(response.body).to.have.a.property('birthDate');
                    expect(response.body).to.have.a.property('StreetAddress');
                    expect(response.body).to.have.a.property('phone');
                    expect(response.body).to.have.a.property('email');
    
    
                })
                .catch(error => {
                    expect.fail(error)
                })
            });
        });
        
        describe('Add a new user', function(){
            it('should add a new user', async function(){
                await chai.request(apiAddress)
                .post('/users')
                .send({
                    userId: uuidv4(),
                    username: 'new user555',
                    name: 'May Somebody',
                    birthDate: '5-5-1975',
                    StreetAddress:{
                        street: 'Somestreet 15',
                        city: 'Oulu',
                        postalCode: '90100',
                        country: 'Finland'
                    },
                    password: 'testpw',
                    phone: "0001111222",
                    email: 'b.c@something.net'
                })
                .then(response => {
                    expect(response.status).to.equal(201);
                    return chai.request(apiAddress).get('/users/'+ users.getUserId('new user555'))
                    .auth("user123", "myPassword")
                })
                .then(readResponse => {
                    expect(readResponse.status).to.equal(200);
                    expect(readResponse.body.name).to.equal("May Somebody");
                    expect(readResponse.body.phone).to.equal("0001111222");
                })
                .catch(error => {
                    expect.fail(error);
                })
            })
        });
    
        describe('Edit a user', function(){
            it('should edit user with username user123 name from Joe Doe to Johnny Doe', async function(){
                await chai.request(apiAddress)
                .put('/users/' + users.getUserId('user123'))
                .auth("user123", "myPassword")
                .send({
                    name: 'Johnny Doe'
                })
                .then(response => {
                    expect(response.status).to.equal(200);
                    return chai.request(apiAddress).get('/users/'+ users.getUserId('user123'))
                    .auth("user123", "myPassword")
                })
                .then(readResponse => {
                    expect(readResponse.status).to.equal(200);
                    expect(readResponse.body.name).to.equal("Johnny Doe");
                })
                .catch(error => {
                    expect.fail(error);
                })
            })
        });
    
        describe('delete a user', function(){
            it('should delete user with username user222 and return not found when trying to search for it later', async function(){
    
                usersId = users.getUserId('user222')
    
                await chai.request(apiAddress)
                .delete('/users/' + usersId)
                .auth("user222", "myPassword")
                .then(response => {
                    expect(response.status).to.equal(200);
                    return chai.request(apiAddress).get('/users/'+ usersId)
                    .auth("user123", "myPassword")                    
                })
                .then(readResponse => {
                    expect(readResponse.status).to.equal(404);
                })
                .catch(error => {
                    expect.fail(error);
                })
            })
        });
    
    });

   

});



