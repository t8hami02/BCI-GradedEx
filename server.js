const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs');

const app = express()
const port = 3000
const users = require('./services/users');
const posts = require('./services/posts');


app.use(bodyParser.json());

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

passport.use(new BasicStrategy(
  function(username, password, done) {

    const user = users.getUserByName(username);
    if(user == undefined) {
      // Username not found
      console.log("HTTP Basic username not found");
      return done(null, false, { message: "HTTP Basic username not found" });
    }

    /* Verify password match */
    if(bcrypt.compareSync(password, user.password) == false) {
      // Password does not match
      console.log("HTTP Basic password not matching username");
      return done(null, false, { message: "HTTP Basic password not found" });
    }
    return done(null, user);
  }
));



app.get('/', (req, res) => {
  res.send('This is an excercise for making an api for a platform for selling and buying used items')
})

app.post('/login', passport.authenticate('basic', { session: false }), (req, res) => {

    res.sendStatus(200);

})

app.get('/posts',  (req, res) => {

    res.json(posts.getAllPosts());

})

app.post('/posts', passport.authenticate('basic', { session: false }), (req, res) => {

    if('title' in req.body == false ) {
        res.status(400);
        res.json({status: "Missing title from body"})
        return;
      }
      if('description' in req.body == false ) {
        res.status(400);
        res.json({status: "Missing description from body"})
        return;
      }
      if('category' in req.body == false ) {
        res.status(400);
        res.json({status: "Missing category from body"})
        return;
      }
      if('location' in req.body == false ) {
        res.status(400);
        res.json({status: "Missing location from body"})
        return;
      }
      if('image' in req.body == false ) {
        res.status(400);
        res.json({status: "Missing image from body"})
        return;
      }
      if('price' in req.body == false ) {
        res.status(400);
        res.json({status: "Missing price from body"})
        return;
      }
      if('deliveryType' in req.body == false ) {
        res.status(400);
        res.json({status: "Missing deliveryType from body"})
        return;
      }
      if('sellerName' in req.body == false ) {
        res.status(400);
        res.json({status: "Missing sellerName from body"})
        return;
      }
      if('sellerContactInfo' in req.body == false ) {
        res.status(400);
        res.json({status: "Missing sellerContactInfo from body"})
        return;
      }
      if('postDate' in req.body == false ) {
        res.status(400);
        res.json({status: "Missing postDate from body"})
        return;
      }
      
    posts.addPost(req.body.title, req.body.description, req.body.category, req.body.location, req.body.image, req.body.price, req.body.deliveryType, req.body.sellerName, req.body.sellerContactInfo, req.body.postDate )

    res.sendStatus(201);
})

app.get('/posts/:postId', (req, res) => {
    const result = posts.getPostById(req.params.postId)
    if(result !== undefined)
    {
        res.json(result);
    } else {
        res.sendStatus(404);
    }
})

app.put('/posts/:postId', passport.authenticate('basic', { session: false }), (req, res) => {
    const result = posts.getPostById(req.params.postId)
    if(result !== undefined)
    {
        for (const key in req.body){
            result[key] = req.body[key];
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
})

app.delete('/posts/:postId', passport.authenticate('basic', { session: false }), (req, res) => {
    const result = posts.getPostById(req.params.postId)
    if (result !== undefined){
        posts.deletePost(req.params.postId)
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
})

app.get('/users', (req, res) => {

    res.json(users.getAllUsers());

})

//user registration
app.post('/users',(req, res) => {

    if('username' in req.body == false ) {
        res.status(400);
        res.json({status: "Missing username from body"})
        return;
      }
      if('name' in req.body == false ) {
        res.status(400);
        res.json({status: "Missing name from body"})
        return;
      }
      if('birthDate' in req.body == false ) {
        res.status(400);
        res.json({status: "Missing birthdate from body"})
        return;
      }
      if('StreetAddress' in req.body == false ) {
        res.status(400);
        res.json({status: "Missing street address from body"})
        return;
      }
      if('password' in req.body == false ) {
        res.status(400);
        res.json({status: "Missing password from body"})
        return;
      }
      if('phone' in req.body == false ) {
        res.status(400);
        res.json({status: "Missing phone from body"})
        return;
      }
      if('email' in req.body == false ) {
        res.status(400);
        res.json({status: "Missing email from body"})
        return;
      }

    const hashedPassword = bcrypt.hashSync(req.body.password, 6);

    users.addUser(req.body.username, req.body.name, req.body.birthDate, req.body.StreetAddress, hashedPassword, req.body.phone, req.body.email)

    res.sendStatus(201);
})



app.get('/users/:userId', passport.authenticate('basic', { session: false }), (req, res) => {
    const result = users.getUserById(req.params.userId)
    if(result !== undefined)
    {
        res.json(result);
    } else {
        res.sendStatus(404);
    }
})


app.put('/users/:userId', passport.authenticate('basic', { session: false }), (req, res) => {
    const result = users.getUserById(req.params.userId)
    if(result !== undefined)
    {
        for (const key in req.body){
            result[key] = req.body[key];
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
})


app.delete('/users/:userId', passport.authenticate('basic', { session: false }), (req, res) => {
    const result = users.getUserById(req.params.userId)
    if (result !== undefined){
        users.deleteUser(req.params.userId)
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
})

let apiInstance = null;

exports.start = () => {
    apiInstance = app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
      })
}

exports.stop = () => {
    apiInstance.close();
}