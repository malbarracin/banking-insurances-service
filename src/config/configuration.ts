

export default () => ({
  port: parseInt(process.env.PORT, 10) || 8084,
  database: {
    uri: process.env.DATABASE_URL,
  },
  usersService: {
    url: process.env.USERS_SERVICE_URL,
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

// This line should be removed since we're using ES modules with export default
