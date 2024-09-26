const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

const pool = mysql.createPool({
    host: 'db',  // Use the service name defined in docker-compose.yml
    user: 'user',
    password: 'abbaswww',
    database: 'userdb',
});

app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).send('Email and password are required.');
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, password]
        );
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Database error:', error); // Log detailed error
        res.status(500).send('Error registering user: ' + error.message);
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));