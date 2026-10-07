require('dotenv').config()
const app = require('./src/app')

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`)
  console.log(`📡 URL: http://localhost:${PORT}`)
})

// Keep the HTTP listener referenced so Node does not exit while it is serving.
server.ref()

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Stop the other server or change PORT in .env.`)
  } else {
    console.error('❌ Server failed to start:', error)
  }

  process.exitCode = 1
})
