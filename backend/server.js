const mongoose = require('mongoose');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION!!! shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

const app = require('./app');

const database = 'mongodb://138.201.127.162:27017/data'

// Connect the database
mongoose.connect(database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology:true,
}).then(con => {
    console.log('=====>>DB connection Successfully!');
    // Start the server
    const port = 8080;
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

