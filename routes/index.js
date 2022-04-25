
const express = require('express');



const router = express.Router();


const {
    getOverTime,
    postOverTime,
    getDaily,
    postDaily,
    getPatent
   
    
} = require('../controllers/index');





router.get('/overtime', getOverTime)
    
    .post('/overtime', postOverTime)
    
    .get('/daily', getDaily)
    
    .post('/daily', postDaily)
    .get('/patent',getPatent)


module.exports = router;