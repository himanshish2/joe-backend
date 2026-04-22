require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')

const app = express()

app.use(cors())
app.use(express.json())

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

// ✅ POST: insert sensor data
app.post('/data', async (req, res) => {
  try {
    const { pir_motion, ir_proximity_cm, mq135_gas_ppm } = req.body

    const { error: insertError } = await supabase
      .from('sensor_readings')
      .insert([
        { pir_motion, ir_proximity_cm, mq135_gas_ppm }
      ])

    if (insertError) {
      console.error("Insert error:", insertError)
      return res.status(500).json(insertError)
    }

    const { data, error: fetchError } = await supabase
      .from('sensor_readings')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)
      .single()

    if (fetchError) {
      console.error("Fetch error:", fetchError)
      return res.status(500).json(fetchError)
    }

    res.json({
      success: true,
      data: data
    })

  } catch (err) {
    console.error("Server error:", err)
    res.status(500).json({ error: "Server crash" })
  }
})


// ✅ GET: fetch ALL sensor data (THIS WAS MISSING)
app.get('/data', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sensor_readings')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      console.error("Fetch error:", error)
      return res.status(500).json(error)
    }

    res.json(data)

  } catch (err) {
    console.error("Server error:", err)
    res.status(500).json({ error: "Server crash" })
  }
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
})