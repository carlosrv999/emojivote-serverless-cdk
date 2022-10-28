export const dbConnectionParams =  {
  connectionLimit : 10,
  host            : process.env.MYSQL_HOST,
  port            : process.env.MYSQL_PORT,
  user            : process.env.MYSQL_USER,
  password        : process.env.MYSQL_PASSWD,
  database        : process.env.MYSQL_DB,
  charset         : 'utf8mb4'
}
