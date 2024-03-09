const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({
    path: './.env'
});

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION!!! shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

const app = require('./app');

const database = process.env.DATABASE || 'mongodb+srv://abrar:abrar@cluster0.xpldp.mongodb.net/BoilerPlatejs'

// Connect the database
mongoose.connect(database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(con => {
    console.log('=====>>DB connection Successfully!');
    // Start the server
    const port = process.env.PORT|| 8080;
    app.listen(port, () => {
        console.log(`
      ################################################
    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
             Server listening on port: ${port}
    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
      ################################################
    `);
    });

    process.on('unhandledRejection', err => {
        console.log('UNHANDLED REJECTION!!!  shutting down ..');
        console.log('====>',err);
        console.log(err.name, err.message);
        server.close(() => {
            process.exit(1);
        });
    });

});

