'use strict';
const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');
const Handlebars = require('handlebars');
const Inert = require('@hapi/inert');

const init = async () => {

    const server = Hapi.server({
        port:3000,
        host: 'localhost'
    });

    // vision registration
    await server.register(Vision);

    // inert registration
    await server.register(Inert);

    
    server.route({
        method: 'GET',
        path: '/',
        handler:(request,h) => {
           
            return h.file('templates/index.html');
        },
        config: {
            auth: false
        }
    });

    // server.route({
    //     method: 'GET',
    //     path: '/assets/css/stylesheet.css',
    //     handler: (request,h) => {
    //         console.log('Handler'+ request.params.filename);
    //         return h.file('assets/css/stylesheet.css');
    //     }
    // });

    server.route({
        path: '/assets/{path*}',
        method: 'GET',
        handler: {
            directory: {
                path: './public',
            listing: false
            }            
        }
    });

    server.ext({
        type: 'onRequest',
        method: function (request, h) {
            // log all incoming requests            
            console.log('Received request'+request.path);            
            return h.continue;
        }
    });

    await server.start();
    console.log ('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();