const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('./db.json')
const middlewares = jsonServer.defaults()
const cors = require('cors')

// Use default middlewares (CORS, static, etc.)
server.use(middlewares)
server.use(cors())

// Use the router
server.use('/api', router)

// Start the server
const PORT = 3000
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`)
})
