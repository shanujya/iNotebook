// npx kill-port 3000

const connectTomongoose = require('./db');
connectTomongoose();

const express = require('express')
const app = express()
const port = 5000

app.use(express.json()) //Middleware

// Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`iNotebook backend listening at http://localhost:${port}`)
})
