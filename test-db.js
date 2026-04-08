const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'sweet_cake_user',
      password: 'sweet_cake_password_dev',
      database: 'sweet_cake_db'
    });
    console.log('Connexion réussie !');
    await connection.end();
  } catch (err) {
    console.error('Erreur de connexion :', err.message);
  }
}

testConnection();
