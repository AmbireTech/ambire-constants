const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 5000

app.use(cors())
app.use(express.static('build'))

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`))
