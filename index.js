require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')

const app = express()

app.use(cors())
app.use(express.json())

// 🔍 Debug: log every incoming request
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`)
  next()
})

console.log("URL:", process.env.SUPABASE_URL)
console.log("KEY exists:", !!process.env.SUPABASE_KEY)

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

// ✅ test route
app.get('/', (req, res) => {
  res.send('Backend working 🚀')
})


// ✅ POST: insert washroom data (FIXED)
app.post('/api/washroom/data', async (req, res) => {
  try {
    console.log("Incoming payload:", req.body);
    const payload = req.body

    console.log("🔥 Incoming:", payload)

    const { data, error } = await supabase
      .from('frontend_readings') // ✅ YOUR TABLE
      .insert([payload])
      .select()

    console.log("📦 Supabase data:", data)
    console.log("❌ Supabase error:", error)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({
      success: true,
      data: data[0]
    })

  } catch (err) {
    console.error("Server error:", err)
    res.status(500).json({ error: "Server crash" })
  }
})


// ✅ GET: fetch ALL washroom data (FIXED)
app.get('/api/washroom/data', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('frontend_readings') // ✅ SAME TABLE
      .select('*')
      .order('timestamp', { ascending: false })

    if (error) {
      console.error("Fetch error:", error)
      return res.status(500).json({ error: error.message })
    }

    res.json(data)

  } catch (err) {
    console.error("Server error:", err)
    res.status(500).json({ error: "Server crash" })
  }
})


// ❗ catch-all route
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    url: req.url
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})