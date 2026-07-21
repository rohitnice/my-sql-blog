const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
    console.log('Connected to database');

    // 1. Create users table FIRST (Independent)
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    // 2. Create posts table SECOND (Depends on users)
    const createPostsTable = `
        CREATE TABLE IF NOT EXISTS posts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(100) NOT NULL,
            excerpt TEXT NOT NULL,
            content LONGTEXT NOT NULL,
            date DATETIME DEFAULT CURRENT_TIMESTAMP,
            user_id INT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        )
    `;

    // 3. Create comments table THIRD (Depends on users and posts)
    const createCommentsTable = `
        CREATE TABLE IF NOT EXISTS comments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            post_id INT NOT NULL,
            user_id INT NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `;

    // 4. Create likes table FOURTH (Depends on users and posts)
    const createLikesTable = `
        CREATE TABLE IF NOT EXISTS likes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            post_id INT NOT NULL,
            user_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_like (post_id, user_id),
            FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `;

    // Execute queries sequentially using callbacks to prevent foreign key errors
    connection.query(createUsersTable, (err) => {
        if (err) {
            console.error('Users table error:', err);
            connection.end();
            process.exit(1);
        }
        console.log('Users table ready');

        connection.query(createPostsTable, (err) => {
            if (err) {
                console.error('Posts table error:', err);
                connection.end();
                process.exit(1);
            }
            console.log('Posts table ready');

            connection.query(createCommentsTable, (err) => {
                if (err) {
                    console.error('Comments table error:', err);
                    connection.end();
                    process.exit(1);
                }
                console.log('Comments table ready');

                connection.query(createLikesTable, (err) => {
                    if (err) {
                        console.error('Likes table error:', err);
                    } else {
                        console.log('Likes table ready');
                        console.log('Database initialization completed successfully!');
                    }
                    connection.end();
                    process.exit(0);
                });
            });
        });
    });
});