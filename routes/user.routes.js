const express = require('express');
const { createUser, updateUser, deleteUser, SignOut, getListings, getUser } = require('../controllers/user.controller');
const { verifyUser } = require('../middleware/verifyuser');
const router = express.Router();

router.get('/', createUser);
router.post('/update/:id', verifyUser, updateUser);
router.delete('/delete/:id', verifyUser, deleteUser);
router.get('/listings/:id', verifyUser, getListings);
router.get('/:id',getUser)//this is for user can contact only if its authenticated




module.exports = router;
