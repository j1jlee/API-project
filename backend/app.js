const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { environment } = require('./config');
const isProduction = environment === 'production'; //true if
//
const routes = require('./routes');


const app = express(); //initialize express application

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

//security middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
}
//helmet helps set a variety of headers to better secure your app
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
);

//set the _csrf token and craete req.csrfToken method
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && 'Lax',
            httpOnly: true
        }
    })
);

app.use(routes);


module.exports = app;
