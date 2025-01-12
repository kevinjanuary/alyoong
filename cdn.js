const express = require("express")
const path = require("path")
// const sharp = require("sharp")
// const fs = require("fs")

const app = express()
const PORT = 3001

// Middleware untuk melayani file statis dari folder 'public'
app.use("/", express.static(path.join(__dirname, "public")))
// app.use("/", async (req, res, next) => {
//   const filePath = path.join(__dirname, "public", req.path)
//   const width =
//     req.query.tr && req.query.tr.match(/w-(\d+)/)
//       ? parseInt(req.query.tr.match(/w-(\d+)/)[1], 10)
//       : null

//   if (width && fs.existsSync(filePath)) {
//     const transformer = sharp(filePath).resize(width)
//     res.type("image/png")
//     transformer.pipe(res)
//   } else {
//     next()
//   }
// })

// Tangani permintaan ke jalur root untuk memastikan server berjalan
app.get("/", (req, res) => {
  res.send("CDN server is running!")
})

// Jalankan server di port 3001
app.listen(PORT, () => {
  console.log(`CDN server is listening on http://localhost:${PORT}`)
})
