require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3001
const apiRouter = require('./routes/api.routes')
const cors = require('cors')

const corsoptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsoptions))

app.use(express.json());

app.use('/api', apiRouter)


app.use((err, req, res) => {
    console.error(err.stack)
    res.status(500).json({ error: 'Algo salió mal en el servidor' })
  })

app.listen(port, () => {
  console.log(`Corrieno en el puerto: ${port}`)
})