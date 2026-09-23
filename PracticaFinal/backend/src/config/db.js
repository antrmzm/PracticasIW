import sql from 'mssql';
import dotenv from 'dotenv';
dotenv.config({ override: true });


export const sqlServerConfig = {
  user: process.env.SQLSERVER_USER,
  password: process.env.SQLSERVER_PASSWORD,
  server: process.env.SQLSERVER_SERVER,
  database: process.env.SQLSERVER_DB,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export const getConnection = async () => {
  try {
    return await sql.connect(sqlServerConfig);
  } catch (error) {
    console.error('SQL Server connection error:', error);
    throw error; // deja que el error real llegue hasta el endpoint
  }
};

console.log('USER:', JSON.stringify(process.env.SQLSERVER_USER));
console.log('PASSWORD length:', process.env.SQLSERVER_PASSWORD?.length);
console.log('SERVER:', JSON.stringify(process.env.SQLSERVER_SERVER));
console.log('DB:', JSON.stringify(process.env.SQLSERVER_DB));