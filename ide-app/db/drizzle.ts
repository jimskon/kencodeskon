import { drizzle } from 'drizzle-orm/mysql2';
import { getConnection } from './connection';

const db = drizzle(getConnection());

export function getDrizzle(){
    return db;
}
