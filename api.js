const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('./db.json')
const middlewares = jsonServer.defaults()
const cors = require('cors')

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
const http = require('http')
setInterval(() => {
  http.get('http://localhost:3000')
}, 300000) // every 5 minutes (300000)
