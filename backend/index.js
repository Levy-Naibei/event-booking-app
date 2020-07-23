import app from './app';
import connectDb from './models';
import env from './config';

connectDb()
    .then(async () => {
        await app.listen(env.PORT);
        console.log(`Server running at port ${env.PORT}...`);
    })
    .catch(console.log);