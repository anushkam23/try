// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// app.use(express.json());
// app.use(cors());

// // MongoDB connection
// const mongoUrl = "mongodb+srv://anushkam254:TjLFXNtclHKd4LbS@cluster0.uwac3kx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// mongoose.connect(mongoUrl, { useNewUrlParser: true })
//   .then(() => {
//     console.log("Connected to database");
//   })
//   .catch((e) => console.log(e));

// // Ensure the upload directory exists
// const uploadDir = path.join(__dirname, 'files');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Set up Multer for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now();
//     cb(null, uniqueSuffix + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// // File upload endpoint
// app.post("/upload-files", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send('No file uploaded.');
//     }
//     console.log(req.file);
//     res.send({ message: 'File uploaded successfully', file: req.file });
//   } catch (error) {
//     console.error('Error during file upload:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // Simple API endpoint for testing
// app.get("/", async (req, res) => {
//   res.send("Success!!");
// });

// // Start the server
// app.listen(5000, () => {
//   console.log("Server started on port 5000");
// });


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use("/files",express.static("files"))
// MongoDB connection
const mongoUrl = "mongodb+srv://anushkam254:TjLFXNtclHKd4LbS@cluster0.uwac3kx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoUrl, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, 'files');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});


require("./pdfDetails");
const PdfSchema=mongoose.model("PdfDetails")
const upload = multer({ storage: storage });

// File upload endpoint
app.post("/upload-files", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send('No file uploaded.');
//     }
    console.log(req.file);
    const title=req.body.title;
    const fileName=req.file.filename;
    try{
await PdfSchema.create({title:title,pdf:fileName});
res.send({status:"ok"});
    } catch(error){
    res.json({status:error});
    }
    // res.send("Hii")
});
//     res.send({ message: 'File uploaded successfully', file: req.file });
//   } catch (error) {
//     console.error('Error during file upload:', error);
//     res.status(500).send('Internal Server Error');
//   }

app.get("/get-files",async(req,res)=>{
    try{
PdfSchema.find({}).then(data=>{
    res.send({status:"ok",data:data});
});
    }
    catch(error){}
});
// Simple API endpoint for testing
app.get("/", async (req, res) => {
  res.send("Success!!");
});

// Start the server
app.listen(5000, () => {
  console.log("Server started on port 5000");
});
