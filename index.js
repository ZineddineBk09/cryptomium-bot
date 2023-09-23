const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('./coinTelegraphData.json')
const middlewares = jsonServer.defaults()

// Use default middlewares (CORS, static, etc.)
server.use(middlewares)

// Use the router
server.use('/api', router)

// Start the server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`)
})
