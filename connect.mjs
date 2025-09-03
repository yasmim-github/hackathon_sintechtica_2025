import argon2 from 'argon2';
import mysql from 'mysql2/promise';

//TODO: dell later
const user = {
    firstName: 'Yasmim',
    lastName: 'Santos',
    email: 'yasmim.s@example.com',
    course: 'Computer Science',
    plainTextPassword: 'MySecurePassword123'
};

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'hackathon'
};

const options = {
    timeCost: 3,       // A little higher than the default of 2
    memoryCost: 65536, // 64 MB
    parallelism: 4,    
    type: argon2.argon2id // Uses the recommended Argon2id variant
};

async function registerUser(userData) {
    let connection;
    try {
        console.log('Hashing password...');
        const passwordHash = await argon2.hash(userData.plainTextPassword, argonOptions);
        console.log('Password successfully hashed.');

        console.log('Connecting to the database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Database connection successful!');

        const insertQuery = `
            INSERT INTO Users (FirstName, LastName, Email, Course, PasswordHash)
            VALUES (?, ?, ?, ?, ?);
        `;
        const values = [
            userData.firstName,
            userData.lastName,
            userData.email,
            userData.course,
            passwordHash
        ];

        console.log('Executing INSERT query...');
        const [result] = await connection.execute(insertQuery, values);
        console.log(`User registered successfully! AccountID: ${result.insertId}`);

    } catch (error) {
        console.error('An error occurred during user registration:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
}

registerUser(user);


async function verifyPassword(storedHash, submittedPassword) {
  try {
    const isMatch = await argon2.verify(storedHash, submittedPassword);

    if (isMatch) {
      console.log('Password matches! User is authenticated.');
      return true;
    } else {
      console.log('Password does not match. Access denied.');
      return false;
    }
  } catch (err) {
    // Handle errors
    console.error('Error verifying password:', err);
  }
}


//tests 

