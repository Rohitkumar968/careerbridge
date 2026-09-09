const dns = require('dns')

// Force reliable DNS for MongoDB Atlas SRV connection
dns.setServers(['8.8.8.8', '1.1.1.1'])

require('dotenv').config()

const app = require('./app')
const connectDB = require('./config/db')

const PORT = process.env.PORT || 5000

connectDB()
  .then(() => {
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`)
    })

    server.on('error', (err) => {
      console.error('Server error:', err)
    })

    process.on('SIGTERM', () => {
      server.close(() => process.exit(0))
    })
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1)
  })