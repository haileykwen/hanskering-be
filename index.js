const express                       = require('express');
const port                          = process.env.PORT || 3001;

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

const cmsRoute = require('./routes/cmsRoute');

app.get('/', (req, res) => res.redirect('/cms/dashboard'));
app.use('/cms', cmsRoute);

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});