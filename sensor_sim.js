const axios = require("axios");

// change this to your deployed backend URL
const URL = "https://joe-backend-6lqy.onrender.com/api/washroom/data";

function getFakeSensorData() {
    return {
        temperature: (20 + Math.random() * 10).toFixed(2),
        humidity: (40 + Math.random() * 20).toFixed(2),
        occupancy: Math.random() > 0.5 ? 1 : 0,
        timestamp: new Date().toISOString()
    };
}

async function sendData() {
    try {
        const data = getFakeSensorData();
        console.log("Sending:", data);

        await axios.post(URL, data);

        console.log("Sent successfully");
    } catch (err) {
        console.log("Error sending data:", err.message);
    }
}

// send every 3 seconds (like real sensor stream)
setInterval(sendData, 3000);