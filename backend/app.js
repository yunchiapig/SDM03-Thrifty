const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


// using swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('js-yaml');
const fs = require('fs');
const swaggerDocument =  YAML.load(fs.readFileSync('./swagger.yaml', 'utf8'));


const healthcheckRouter = require('./routes/healthcheck');
const usersRouter = require('./routes/users');

// admin routers
const storeAdminRouter = require('./routes/store_info_api');
const foodAdminRouter = require('./routes/food_info_api');
const stockAdminRouter = require('./routes/stock_info_api');

// get routers
const getStoresRouter = require('./routes/get_stores_api');
const getFoodsRouter = require('./routes/get_foods_api');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// default middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routers
app.use('/healthcheck', healthcheckRouter);
app.use('/users', usersRouter);

// admin routers
app.use('/api/1.0/admin/store', storeAdminRouter);
app.use('/api/1.0/admin/food', foodAdminRouter);
app.use('/api/1.0/admin/stock', stockAdminRouter);

// get routers
app.use('/get/stores', getStoresRouter);
app.use('/get/foods', getFoodsRouter);

// swagger ui
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
