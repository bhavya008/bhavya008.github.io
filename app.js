require('dotenv').config();
const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const Contact = require('./model/Contact');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3000;

const DBURI = process.env.MONGO_URI;
mongoose.connect(DBURI)
    .then((result) => console.log("contected!"))
    .catch((err) => console.log(err));

app.get('/pratima', (req, res) => {
    res.render('pratima', {title: "Pratima"});
})

app.get('/gallery', (req, res) => {
    res.render('gallery', {title: "Gallery"});          
})

app.get('/donate', (req, res) => {
    res.render('donate', {title: "Donate"});
})

app.get('/events', (req, res) => {
    res.render('events', {title: "Events"});
})

app.get('/newsletter', (req, res) => {
    res.render('newsletter', {title: "News Letter"});
})

app.get('/about', (req, res) => {
    res.render('about', {title: "About"});
})

app.get('/contactUs', (req, res) => {
    res.render('contactUs', {title: "Contact Us", message: ""});
})

app.post('/contactUs', async (req, res) => {
    const { fullName, email, phone, subject, message } = req.body;

    let contactForm = new Contact({
        fullName,
        email,
        phone,
        subject,
        message
    });

    contactForm.save()
        .then((result) => {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'bhavyshah2612@gmail.com',
                    pass: 'etwr jdzs tghk cwxr'
                }
            });

            console.log(email);
            transporter.sendMail({
                from: email, 
                to: 'bhavyshah2612@gmail.com', // Send the email to the owner
                replyTo: email, // Set the replyTo field to the sender's email address
                subject: subject,
                text: `Message: ${message}\n\nReply to: ${email}` // Optionally include the sender's email in the message body
            }).then(() => {
                res.render('contactUs', { title: 'Contact Us', message: "Message sent" });
            }).catch((err) => {
                console.error(err);
                res.status(500).send('Error sending email');
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error saving contact form data');
        });
});

app.get('/', (req, res) => {
    res.render('index', {title: "Home"});
})

app.listen(PORT, () => {
    console.log("server started on " + PORT);
})