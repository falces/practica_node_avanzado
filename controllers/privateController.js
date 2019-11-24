'use strict';

class PrivateController
{
    index(req, res, next)
    {
        res.render('private', {
            title: 'Login de usuario'
        });
    }
}

module.exports = new PrivateController();