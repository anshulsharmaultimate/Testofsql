const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Your Railway MySQL Credentials
const db = mysql.createConnection({
  host: 'mysql.railway.internal',
  user: 'root',
  password: 'FgjpXoDlAJgdjnAeCyHVlqhupcQarbbL',
  database: 'railway',
  port: 3306
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Connected to Railway MySQL database.');
  }
});

// Route to handle form submission
app.post('/submit-form', (req, res) => {
  const { name, mobile, email } = req.body;

  if (!name || !mobile || !email) {
    return res.status(400).json({ message: 'Please provide all fields.' });
  }

  const query = \`
    INSERT INTO T_FORM (FORM_NAME, FORM_MOBILENO, FORM_EMAILID)
    VALUES (?, ?, ?)
  \`;

  db.query(query, [name, mobile, email], (err, result) => {
    if (err) {
      console.error('❌ Error inserting data:', err.message);
      res.status(500).json({ message: 'Database error' });
    } else {
      res.status(200).json({ message: 'Form submitted successfully!' });
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(\`🚀 Server running at http://localhost:\${port}\`);
});