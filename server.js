const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const app = express();
const { connectDB, collection, Carousel } = require("./schema");
const session = require('express-session');

app.use(session({
    secret: 'cngsgkhr01qq9hn97df0cngsgkhr01qq9hn97dfg',
    resave: false,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.set('view engine', 'ejs');


app.get("/", async (req, res) => {
    if (req.session.isAuthenticated) {
        const carousels = await Carousel.find();
        res.render("blog", { carousels });
    } else {
        res.render("login");
    }
});


app.get("/api1", (req, res) => {
    res.render("prayer");
});


app.get("/signup", (req,res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password,
        email: req.body.email
    }

    const existingUser = await collection.findOne({ name: data.name });
    if (existingUser) {
        res.send("The Username already exists. Please choose another Username.");
    } else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'zh.zhanibekova2004@gmail.com', 
                pass: 'qvqz ljyy qapf ermt' 
            }
        });

        const mailOptions = {
            from: 'zh.zhanibekova2004@gmail.com',
            to: data.email,
            subject: 'Welcome to Photographer Blog!',
            text: 'Thank you for registering with us. We hope you enjoy our blog.'
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.error(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        const userdata = await collection.insertMany(data);
        console.log(userdata);
        res.redirect('/');
    }
});
connectDB();


app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send("Username not found");
            return;
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            req.session.isAuthenticated = true; // Set user as authenticated
            res.redirect("/"); // Redirect to the blog page
        } else {
            res.send("Password is incorrect");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Login failed");
    }
});


app.post("/addCarousel", async (req, res) => {
    const { url1, url2, url3, name, description } = req.body;

    const newCarousel = new Carousel({
        urls: [url1, url2, url3],
        name,
        description
    });

    try {
        await newCarousel.save();
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to add carousel");
    }
});

app.get("/editCarousel/:id", async (req, res) => {
    try {
        const carousel = await Carousel.findById(req.params.id);
        res.render("editCarousel", { carousel });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to fetch carousel");
    }
});

app.post("/editCarousel/:id", async (req, res) => {
    const id = req.params.id;
    const newData = {
        urls: req.body.urls,
        name: req.body.name,
        description: req.body.description
    };

    try {
        const updatedCarousel = await Carousel.findOneAndUpdate(
            { _id: id },
            { $set: newData },
            { new: true }
        );
        console.log(updatedCarousel);
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to update carousel");
    }
});









app.post("/deleteCarousel/:id", async (req, res) => {
    try {
        await Carousel.findByIdAndDelete(req.params.id);
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to delete carousel");
    }
});



const port = 3000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});