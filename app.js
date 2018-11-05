const express = require('express')
const mustacheExpress = require('mustache-express')
const port = 3000
var bodyParser = require('body-parser')
const app = express()
var session = require('express-session')
let alltrips = []
let trips = []
let users = [{
    username: "kevin",
    password: "1234"
}]

app.use(session({
    secret: 'cat',
    resave: false,
    saveUninitialized: false
}))

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use('/tripsite', express.static('css'))

app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set("view engine", "mustache")


app.get('/', function (req, res) {
    if (req.session.username) {
        res.render('report', {
            username: req.session.username
        })
    } else {
        console.log('ERROR: NOT LOGGED IN')
        res.redirect('/login')
    }
})

app.post('/login', function (req, res) {
    let username = req.body.username
    let password = req.body.password

    let user = users.find(function(user){
        return user.username == username && user.password == password
    })
    if (user != null) {
        console.log('USER FOUND')
        if (req.session) {
            req.session.username = username
            res.redirect('/')
        }
    }
    else{
        console.log("ERROR, USER NOT FOUND")
    }
})


app.post('/register', function (req, res) {
    let username = req.body.username
    let password = req.body.password

    users.push({
        username: username,
        password: password
    })
})

app.get("/login", function (req, res) {
    res.render("login")
})

app.get('/report', function (req, res) {
    if (req.session.username) {
        let username = req.session.username

        res.render('report', {
            tripList: trips,
            username: username
        })
    } 
    
    else {
        res.redirect('/login')
    }
})

app.post("/report", function (req, res) {

    let title = req.body.tripTitle
    let departure = req.body.departureDate
    let returnDay = req.body.returnDate
    trips.push({
        title: title,
        departure: departure,
        return: returnDay
    })

    // redirect will invoke the /trips route
    res.redirect("/report")

})

app.post('/delete-trip', function (req, res) {
    let name = req.body.tripName
    console.log(name)
    trips = trips.filter(function (trip) {


        return trip.title != name
    })
    res.redirect('/report')
})

app.listen(port, function () {
    console.log("Server is running... ")
})