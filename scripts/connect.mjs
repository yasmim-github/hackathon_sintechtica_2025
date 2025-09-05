import express from 'express';
import argon2 from 'argon2';
import mysql from 'mysql2/promise';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// Obter __dirname em módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'static'))); 

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'hackathon'
};

const argonOptions = {
    timeCost: 3,
    memoryCost: 65536,
    parallelism: 4,
    type: argon2.argon2id
};


async function initializeDatabase() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS Users (
                AccountID INT AUTO_INCREMENT PRIMARY KEY,
                FirstName VARCHAR(50) NOT NULL,
                LastName VARCHAR(50) NOT NULL,
                Email VARCHAR(100) UNIQUE NOT NULL,
                Course VARCHAR(100) NOT NULL,
                PasswordHash VARCHAR(255) NOT NULL,
                CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        await connection.execute(createTableQuery);
        console.log('Tabela Users verificada/criada com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Função para registrar usuário
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

        return { success: true, accountId: result.insertId };

    } catch (error) {
        console.error('An error occurred during user registration:', error);
        
        // Verificar se é um erro de duplicação de e-mail
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            return { success: false, message: 'Este e-mail já está cadastrado.' };
        }
        
        return { success: false, message: 'Erro interno do servidor.' };
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
}

// Rota para servir a página de registro
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Rota para registro de usuário
app.post('/api/register', async (req, res) => {
    try {
        console.log('Recebendo dados de registro:', req.body);
        
        const userData = req.body;
        
        // Validação básica
        if (!userData.firstName || !userData.lastName || !userData.email || !userData.course || !userData.plainTextPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Todos os campos são obrigatórios.' 
            });
        }
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Por favor, insira um e-mail válido.' 
            });
        }
        
        // Validar comprimento da senha
        if (userData.plainTextPassword.length < 8) {
            return res.status(400).json({ 
                success: false, 
                message: 'A senha deve ter pelo menos 8 caracteres.' 
            });
        }
        
        // Registrar usuário
        const result = await registerUser(userData);
        
        if (result.success) {
            res.status(201).json({ 
                success: true, 
                message: 'Usuário registrado com sucesso!',
                accountId: result.accountId
            });
        } else {
            res.status(400).json({ 
                success: false, 
                message: result.message || 'Falha ao registrar usuário.' 
            });
        }
    } catch (error) {
        console.error('Erro no endpoint de registro:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor.' 
        });
    }
});

// Rota para verificar se o servidor está funcionando
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor está funcionando!' });
});

// Iniciar servidor
app.listen(port, async () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    // Inicializar o banco de dados quando o servidor iniciar
    await initializeDatabase();
});

// Exportar para testes
export { registerUser, argonOptions, initializeDatabase };