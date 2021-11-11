const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'skidipapap', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/cms/auth/login');
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        res.redirect('/cms/auth/login');
    }
};

const requireUnauth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'skidipapap', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                next();
            } else {
                console.log(decodedToken);
                res.redirect('/cms/app/dashboard');
            }
        });
    } else {
        next();
    }
};

module.exports = { 
    requireAuth,
    requireUnauth 
};