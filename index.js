import express from "express";
import bodyParser from "body-parser"; //to process the request body
import mongoose from "mongoose"; // data base modelling
import cors from "cors"; //cross origin requests -> so the domain can be accessed anywhere
import dotenv from "dotenv"; // to hide certain credentials
import multer from "multer"; // for files upload
import helmet from "helmet"; // security package -> for REQUESTS safety
import morgan from "morgan"; // for login
import path from "path";// allows us to properly set the paths, when we configure directories
import { fileURLToPath } from "url";  //and this too
import authRoutes from "./routes/auth.js"; // paths & routes for every type of feature (auth here)
import userRoutes from "./routes/users.js"; 
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

/* <<<<<<<<<MIDDLEWARE & PACKAGE CONFIGURATIONS >>>>>>>>>>>>>*/
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); // this is only when you use the type modules
dotenv.config();
const app = express(); 
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); 
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets"); // will be saved into this folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);
// INSTALL INTELLISENSE

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001; // as a backup
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
  })
  .then(() => {
    // app.listen(8080, () => console.log('Server has started on port http://localhost:8080'))
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD MOCK DATA ONE TIME */
    // be careful to add this DATA only onetime
    // User.insertMany(users);
    // Post.insertMany(posts);
  })  
  .catch((error) => console.log(`${error} did not connect`));
