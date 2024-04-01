const express = require("express")
const app = express()
const cors = require("cors")

app.use(
  cors({
    origin: "*"
  })
)

app.get("/distance", async(req, res) => {
  const {origin, destinations, apiKey} = req.query
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destinations)}&key=${apiKey}`;
  try {
    const response = await fetch(url)
    const data = await response.json()
    res.json(data)
  } catch (error) {
    res.status(500).json({error: "Internal Server Error"})
  }

})

app.listen(3001, () => {
  console.log('Proxy server started')
})
