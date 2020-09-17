const PORT = process.env.PORT || 3000
const express = require('express')

const app = express()



app.listen(PORT, (e) => {
  if (e) throw e
  console.log("Lighting Server listening on port", PORT)
})
