// server.js
const next = require('next')
const express = require('express') // Sử dụng framework express
var cookieParser = require('cookie-parser');
var logger = require('morgan')
var cors = require('cors')
var usersRouter = require('./server/routes/users');
var loansRouter = require('./server/routes/loans');
var walletsRouter = require('./server/routes/wallets');

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000
// when using middleware `hostname` and `port` must be provided below
const server = next({ dev, hostname, port })
const handle = server.getRequestHandler()



server.prepare().then(() => {
    const app = express();

    app.use(cors());
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    //app.use(express.static(path.join(__dirname, 'public')));
    app.use('/api/users', usersRouter);
    app.use('/api/loans', loansRouter);
    app.use('/api/wallets', walletsRouter);

    app.get('*', (req, res) => {
        return handle(req, res);
    })
    // // catch 404 and forward to error handler
    // app.use(function(req, res, next) {
    //   next(createError(404));
    // });

    // error handler
    app.use((err, req, res, next) => {
        console.error(err.stack)
        res.status(500).json(err)
    })
    console.log(process.env.DATABASE_URL)
    const port = 3001;
    app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    })
}).catch(ex => {
    console.error(ex.stack);
    process.exit(1);
})