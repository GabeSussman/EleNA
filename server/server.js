const express = require('express')
const app = express()

app.length("/api", (req, res) => {
    res.json({"test": "testPass"})
})

app.listen(5000, () => {console.log("Server started on port 5000")})