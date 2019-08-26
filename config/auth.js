module.exports = {
    ensureAuthenticated: (req, res, next) =>{
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_mesg', 'Your have to log in to view this resource');
        res.redirect('/login');
    }
}