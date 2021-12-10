const express                           = require('express');
const port                              = process.env.PORT || 3001;
const cookieParser                      = require('cookie-parser');
const { requireAuth }    = require('./middlewares/cmsAuthMiddleware');

const app = express();

app.set('view engine', 'ejs');

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

app.use('/cms/auth', cmsAuthRoute);
app.use('/cms/app', requireAuth, cmsAppRoute);
app.use('/api/product', requireAuth, apiProductRoute);
app.use('/api/user', apiUserRoute);
app.get('/*', (req, res) => res.redirect('/cms/app/dashboard'));

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});