const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (error) => {
  console.log('Uncaught Exception! Shutting down...');
  console.log(error);
  console.error(error.name, error.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT || 3000;

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  // .connect(DB, {
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successfull');
  });

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (error) => {
  console.error(error.name, error.message);
  console.log('Unhandled Rejection! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
