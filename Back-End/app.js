const path = require('path');

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
require('express-async-errors');
require('dotenv').config();

// security packages
const cors = require('cors');
// const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

// routers
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// 404 and error handler middlewares
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');

const app = express();

app.set('trust proxy', 1);
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     limit: 60, // Limit each IP to 60 requests per `window` (here, per 15 minutes)
//   })
// );

app.use(
  helmet({
    crossOriginResourcePolicy: false, // forced same-origin header that clashes with cors
  })
); // helps secure Express apps by setting HTTP response headers
app.use(cors()); // to resolve cross-origin resource sharing with front-end
app.use(xss()); // cross-site scripting protection
app.use(mongoSanitize()); // to prevent mongo script injection

app.use(morgan('dev')); // request logger middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // to statically serve images/videos
app.use(fileUpload());

app.get('/', (req, res) => {
  res.send('<h1>EduFlex API</h1><a href="/api-docs">Documentation</a>');
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/reviews', reviewRoutes);

app.use(notFound); // catch-all route
app.use(errorHandler); // all errors will be forwarded to this middleware

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started on port: ${port}`);
    });
  })
  .catch((err) => console.log(err));
