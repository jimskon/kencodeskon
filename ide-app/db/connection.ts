
import mysql from 'mysql2/promise';

const connectionPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE,
  });

export function getConnection(): mysql.Pool {
    return connectionPool;
}