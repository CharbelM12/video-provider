export default () => ({
  database: {
    connectionString: process.env.DB_CONNECTION_STRING,
  },
  port: process.env.PORT,
  validationPipe: {
    booleanValue: true,
  },
  jwt: {
    secret: process.env.ACCESS_TOKEN_SECRET,
  },
});
