export default () => ({
  PORT: parseInt(process.env.PORT, 10) || 3005,
  HOST: `${process.env.HOST}` || 'http://localhost',
  ADMIN_USER: `${process.env.ADMIN_USER}`,
  ADMIN_PASSWORD: `${process.env.ADMIN_PASSWORD}`,
  HOST_API: `${process.env.HOST}:${parseInt(process.env.PORT, 10)}/api`,
  DB: {
    DB_PASSWORD: `${process.env.DB_PASSWORD}`,
    DB_NAME: `${process.env.DB_NAME}`,
    DB_USER: `${process.env.DB_USER}`,
    DB_HOST: `${process.env.DB_HOST}`,
    DB_PORT: parseInt(process.env.DB_PORT, 10) || 6432,
    DB_TZ: `${process.env.DB_TZ}`,
  },
  JWT_SECRET: `${process.env.JWT_SECRET}`,
  JWT_EXPIRES: `${process.env.JWT_EXPIRES}`, 
});

 