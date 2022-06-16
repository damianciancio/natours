const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

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
  .then((conn) => {
    console.log('DB connection successfull');
    if (process.argv[2] === '--import') {
      importData();
    }
    if (process.argv[2] === '--delete') {
      deleteAllData();
    }
  });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteAllData = async () => {
  try {
    await Tour.deleteMany({});
    console.log('Data successfully deleted');
    process.exit();
  } catch (error) {
    console.log(error);
  }
}



console.log(process.argv);