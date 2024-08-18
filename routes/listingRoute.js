const express=require('express');
const { createListing, deleteListing, updateListing, getListings, getAllListings } = require('../controllers/listingController');
const { verifyUser } = require('../middleware/verifyuser');


const router = express.Router();

router.post('/create',verifyUser,createListing)
router.delete('/delete/:id',verifyUser,deleteListing)
router.post('/update/:id',verifyUser,updateListing)
router.get('/get/:id',getListings) //get is fo rshwoing old data in  fields 
router.get('/get',getAllListings)



module.exports=router