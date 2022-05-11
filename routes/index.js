
const express = require('express');



const router = express.Router();


const {
    getOverTime,
    postOverTime,
    getDaily,
    postDaily,
    getPatent,
    postPatent
    
   
    
} = require('../controllers/index');





router.get('/google', getOverTime)
    
    .post('/google', postOverTime)
    
    .get('/daily', getDaily)
    
    .post('/daily', postDaily)
    .get('/patent',getPatent)
    .post('/patent',postPatent)
    
    


module.exports = router;