import mongoose from 'mongoose';
import { DATABASE_URL } from '../config';

const options = {
    poolSize: 10,
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
};

/**
 * Establish database connection
 */
const connectDb = () => mongoose.connect(DATABASE_URL, options);

module.exports = connectDb;