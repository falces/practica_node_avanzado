'use strict';

const jwt = require('jsonwebtoken');

module.exports = function(roleToCheck){
    // Devolvemos un middleware
    return function(req, res, next){
        // Leer el token que me mandan
        const token = req.body.token || req.query.token || req.get('Authorization');

        // Si no hay token no dejo pasar
        if(!token){
            const err = new Error('No token provided');
            err.status = 401;
            next(err);
            return;
        }

        // Si el token es inválido no dejo pasar
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if(err){
                const err = new Error('Invalid token');
                err.status = 401;
                next(err);
                return;
            }
            // req.apiUserId = payload._id;
            req.jwtPayload = payload;
            // El token es válido
            next();
        });
    }
}