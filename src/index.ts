/*
const express = require("express")
const path = require("path")
const app = express()
// const hbs = require("hbs")
const LogInCollection = require("./mongo")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//const collection=require("./mongodb")
const port = process.env.PORT || 3000
app.use(express.json())

app.use(express.urlencoded({ extended: false }))
const secretKey = '82481';
const tempelatePath = path.join(__dirname, '../tempelates')
const publicPath = path.join(__dirname, '../public')
console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))


// hbs.registerPartials(partialPath)

function authenticate(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}


app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})



// app.get('/home', (req, res) => {
//     res.render('home')
// })

app.post('/signup', async (req, res) => {
    
    try {
      const checking = await LogInCollection.findOne({ name: req.body.name });
      
      if (checking) {
        res.send("User details already exist");
      } else 
      {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const data = {
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword

        };
        
        //await LogInCollection.create(data);
       // res.send("User registered successfully");
     //  res.render('signup', { message: 'User registered successfully' })
         const createdUser = await LogInCollection.create(data);
          const token = jwt.sign({ id: createdUser._id }, secretKey);
          res.status(201).json({ token });
      // res.render('login')
      }
    } catch (error) {
      res.send("An error occurred "+error);
    }
 

    res.status(201).render("home", {
        naming: req.body.name
    })
});


app.post('/login', async (req, res) => {

    try {
        console.log("entered received")
        const check = await LogInCollection.findOne({ name: req.body.name })

        if (!check) {
          res.send("User not found");
        
        }

        else 
        {
          const passwordMatch = await bcrypt.compare(req.body.password, check.password);
          if(passwordMatch)
          {
            const token = jwt.sign({ id: passwordMatch._id }, secretKey);
            //res.status(201).json({ token });
            res.render('home');
          }
          else 
          {
            res.send('Incorrect password');
          }
          //  res.status(201).render("home", { naming: `${req.body.password}+${req.body.name}` })
        }


    } 
    
    catch (e) {

        res.send("wrong details "+e)
        

    }


})

app.get('/protected', authenticate, (req, res) => {
  res.send('This is a protected route');
});



app.listen(port, () => {
    console.log('port connected');
})

*/

import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import LogInCollection from "./mongo";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const app: Application = express();
const port: number = parseInt(process.env.PORT || '3000', 10);

//const port: number = process.env.PORT || 3000;
const secretKey: string = "82481";
const tempelatePath: string = path.join(__dirname, "../tempelates");
const publicPath: string = path.join(__dirname, "../public");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "hbs");
app.set("views", tempelatePath);
app.use(express.static(publicPath));

function authenticate(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, secretKey) as { id: string };
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

app.get("/signup", (req: Request, res: Response) => {
  res.render("signup");
});

app.get("/", (req: Request, res: Response) => {
  res.render("login");
});

app.post("/signup", async (req: Request, res: Response) => {
  try {
    const checking = await LogInCollection.findOne({ name: req.body.name });

    if (checking) {
      res.send("User details already exist");
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const data = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      };

      const createdUser = await LogInCollection.create(data);
      const token = jwt.sign({ id: createdUser._id }, secretKey);
      res.status(201).json({ token });
    }
  } catch (error) {
    res.send("An error occurred " + error);
  }

  res.status(201).render("home", {
    naming: req.body.name,
  });
});

app.post("/login", async (req: Request, res: Response) => {
  try {
    const check = await LogInCollection.findOne({ name: req.body.name });

    if (!check) {
      res.send("User not found");
    } else {
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        check.password
      );
      if (passwordMatch) {
        const token = jwt.sign({ id: passwordMatch._id }, secretKey);
        res.render("home");
      } else {
        res.send("Incorrect password");
      }
    }
  } catch (e) {
    res.send("wrong details " + e);
  }
});

app.get("/protected", authenticate, (req: Request, res: Response) => {
  res.send("This is a protected route");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
