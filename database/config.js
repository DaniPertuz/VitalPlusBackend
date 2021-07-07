const mongoose = require('mongoose');

const dbConnection = async () => {

    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('Base de datos en línea');
    } catch (error) {
        console.error(error);
        throw new Error('Error en conexión a BD');
    }
}

module.exports = {
    dbConnection
}