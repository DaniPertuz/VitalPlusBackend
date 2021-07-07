const express = require('express');
const cors = require('cors');
const path = require('path');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.PORT = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            patients: '/api/patients',
            procedures: '/api/procedures',
            professionals: '/api/professionals',
            payments: '/api/payments',
            search: '/api/search',
            users: '/api/users'
        }

        this.connectionDB();

        // Middlewares
        this.middlewares();

        // Routes
        this.routes();
    }

    listen() {
        this.app.listen(this.PORT, () => {
            console.log(`Servidor activo en puerto ${this.PORT}`);
        });
    }

    async connectionDB() {
        await dbConnection();
    }

    middlewares() {
        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio público
        this.app.use(express.static('public'));

        // CORS
        this.app.use(cors());
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.patients, require('../routes/patients'));
        this.app.use(this.paths.payments, require('../routes/payments'));
        this.app.use(this.paths.procedures, require('../routes/procedures'));
        this.app.use(this.paths.professionals, require('../routes/professionals'));
        this.app.use(this.paths.search, require('../routes/search'));
        this.app.use(this.paths.users, require('../routes/users'));
    }
}

module.exports = Server;