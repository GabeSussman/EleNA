const express = require('express')
const app = express()

app.get("/api", (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.json("test")
})

app.listen(5000, () => {console.log("Server started on port 5000")})