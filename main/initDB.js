import Datastore from 'nedb-promises';

export const usersDB = Datastore.create({ filename: './db/users.db', autoload: true });
