const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('./db.json')
const middlewares = jsonServer.defaults()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

// Use default middlewares
server.use(middlewares)
server.use(cors())

// Use the router
server.use('/api', router)

// Start the server
const PORT = 3000
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`)
})

// to prevent the server from sleeping every 15 minutes when deployed on render.com
// we will ping the server every 5 minutes
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000'
setInterval(() => {
  console.log('Pinging server...', SERVER_URL)
  fetch(SERVER_URL)
    .then((res) => res.text())
    .then((body) => console.log(body))
    .catch((err) => console.error(err))
}, 300000) // every 5 minutes (300000)
