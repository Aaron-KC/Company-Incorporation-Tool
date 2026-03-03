const pool = require('../config/db');

pool.getConnection()
  .then((connection) => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);  
  });
