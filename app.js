
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();


app.use(morgan('combined'));

app.set('view engine', 'ejs');
    
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(helmet());

const index = require('./routes/index');
app.get('/', (req, res)=>{
    res.redirect('/trends/google')
});

app.use('/trends', index);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server  on PORT ${PORT}`);
});