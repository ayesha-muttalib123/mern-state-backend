// const User = require("../models/user.model");
// const bcrypt = require('bcrypt');
// const jwt=require('jsonwebtoken')
// require('dotenv').config()

// exports.Signup = async (req, res) => {
//     try {
//         const { username, email, password } = req.body;

//         // Check if the user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ error: 'User already exists' });
//         }
//         if(!password){
//             return res.status(400).json({ error: 'password required' });
//         }
//         if(!password>=6){
//             return res.status(400).json({ error: 'min length of pasword should be 6' });
//         }


//         // Hash the password
//         const hashPassword = bcrypt.hashSync(password, 10);

//         // Create a new user
//         const newUser = await User.create({
//             username,
//             email,
//             password: hashPassword
//         });

//         // Save the new user
        

//         res.status(200).json({ message: 'User created successfully' });

//     } catch (err) {
//         console.error(err); // Log the error
//         res.status(500).json({ error: 'Server error', details: err.message });
//     }
// };

// exports.SignIn=async(req,res)=>{
//     const {email,password}=req.body;
//     try {
//      const validUser=await User.findOne({email});
//      if(!validUser){
//         return res.status(400).json({error:'Invalid email or password'});
        
//     } 
//     const validPassword=bcrypt.compareSync(password,validUser.password)
// if(!validPassword){
//    return res.status(400).json({error:'Invalid Credentials'}) 
// }
//     const token=jwt.sign({id:validUser._id},process.env.SECRET_KEY)
//     // password npt showing 
//     const {password:pass,...rest}=validUser._doc;
//     // cookie setting 
//     res.cookie('jwt',token,{httpOnly:true,maxAge:3600000}).status(200).json(rest)

//     // you can do like this
//     // res.cookie('jwt',token,{httpOnly:true})

//     }
//     catch (err) {
        
//     }
// }
const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.Signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        if (!password) {
            return res.status(400).json({ error: 'Password required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password should be at least 6 characters' });
        }

        // Hash the password
        const hashPassword = bcrypt.hashSync(password, 10);

        // Create a new user
        const newUser = await User.create({
            username,
            email,
            password: hashPassword
        });

        res.status(200).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err); // Log the error
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

exports.SignIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ id:validUser._id }, process.env.SECRET_KEY);
        const { password: pass, ...rest } = validUser._doc;
        res.cookie('access_cookie', token, { httpOnly: true, maxAge: 3600000 }).status(200).json(rest);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};




exports.SignInWithGoogle = async (req, res) => {
    try {
        // Extract the email from the request body
        const { email } = req.body;

        // Find a user in the database with the given email
        const user = await User.findOne({ email });

        if (user) {
            // If user exists, create a JWT token using the user's ID and a secret key from environment variables
            const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
            
            // Destructure the user object to exclude the password from the response
            const { password: pass, ...rest } = user._doc;
            
            // Set a cookie named 'access_cookie' with the token, marked as HttpOnly for security
            // Send the response with status 200 and the user data (excluding the password)
            res.cookie('access_cookie', token, { httpOnly: true }).status(200).json(rest);
        } else {
            // If user does not exist, generate a random password
            // Math.random() generates a random floating-point number between 0 (inclusive) and 1 (exclusive)
            // .toString(36) converts the number to a base-36 string (using 0-9 and a-z)
            // .slice(-8) extracts the last 8 characters of the string
            // Combining two such slices to create a 16-character random password
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            
            // Hash the generated password using bcrypt with a salt rounds value of 10
            const hashPassword = bcrypt.hashSync(generatePassword, 10);
            
            // Create a new user in the database with a unique username, provided email, hashed password, and avatar
            const user = await User.create({
                // Create a unique username by concatenating the provided name (without spaces) and a random string
                // .split(" ") splits the name into an array of words
                // .join("") joins the array elements into a single string without spaces
                // .toLowerCase() converts the string to lowercase
                // Math.random().toString(36).slice(-4) adds a random 4-character string to ensure uniqueness
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashPassword,
                avatar: req.body.photo
            });
            
            // Create a JWT token for the new user using their ID and the secret key
            const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
            
            // Destructure the user object to exclude the password from the response
            const { password: pass, ...rest } = user._doc;
            
            // Set a cookie named 'access_cookie' with the token, marked as HttpOnly for security
            // Send the response with status 200 and the new user data (excluding the password)
            res.cookie('access_cookie', token, { httpOnly: true }).status(200).json(rest);
        }
    } catch (error) {
        // If an error occurs, send a response with status 500 and an error message
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};
exports.SignOut=async(req,res)=>{
    try {
        res.clearCookie('access_cookie')
        res.status(200).json('User has been logged out')
        
        
    } catch (error) {
    
        res.status(error)
        
    }
    
      }