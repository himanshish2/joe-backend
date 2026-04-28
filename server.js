const express = require('express');
const app = express();

// ✅ Middleware to read JSON
app.use(express.json());

// ✅ Test route
app.get('/', (req, res) => {
    res.send("Backend is working");
});

// ✅ Your required POST route
app.post('/api/washroom/data', (req, res) => {
    console.log("Data received:", req.body);

    res.status(200).json({
        message: "Data received successfully"
    });
});

// ❗ IMPORTANT FIX for Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});