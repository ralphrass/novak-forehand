const next = require('next')
const http = require('http')

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 8080
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
  .then(() => {
    http.createServer((req, res) => {
      handle(req, res)
    }).listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
  .catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
  })