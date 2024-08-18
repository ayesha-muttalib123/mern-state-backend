

const express = require('express');
const { Signup, SignIn, SignInWithGoogle, SignOut } = require('../controllers/auth.controller');


const router = express.Router();

router.post('/signup',Signup);
router.post('/signin',SignIn);
router.post('/google',SignInWithGoogle);
router.get('/signout',SignOut)



module.exports = router;
