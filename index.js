const express                           = require('express');
const port                              = process.env.PORT || 3001;
const cookieParser                      = require('cookie-parser');
const cors                              = require('cors');
const multer                            = require('multer');
const upload                            = multer();
const { requireAuth }                   = require('./middlewares/cmsAuthMiddleware');

const app = express();

app.set('view engine', 'ejs');

// for parsing multipart/form-data
app.use(upload.array());

app.use(cors());
app.use((req, res, next) => { // Handle error CORS policy
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Method', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
}) 

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

const cmsAuthRoute      = require('./routes/cmsAuthRoute');
const cmsAppRoute       = require('./routes/cmsAppRoute'); 
const apiProductRoute   = require("./routes/apiProductRoute");
const apiUserRoute      = require("./routes/apiUserRoute");
const apiOrderRoute      = require("./routes/apiOrderRoute");

app.use('/cms/auth', cmsAuthRoute);
app.use('/cms/app', requireAuth, cmsAppRoute);
app.use('/api/product', requireAuth, apiProductRoute);
app.use('/api/user', apiUserRoute);
app.use('/api/order', requireAuth, apiOrderRoute);
app.get('/*', (req, res) => res.redirect('/cms/app/dashboard'));

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});