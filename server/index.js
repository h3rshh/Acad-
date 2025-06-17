const express = require("express");
const app = express();
const multer = require("multer");

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary")
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();

// Multer configuration
// const upload = multer({
//     storage: multer.memoryStorage(), // Stores files in memory (can be replaced with disk storage)
//     limits: {
//         fileSize: 10 * 1024 * 1024, // Limit files to 10MB
//     },
// });

// Apply Multer globally as middleware
// app.use(upload.any()); 

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"https://api.razorpay.com",
			"https://checkout.razorpay.com",
			"https://lumberjack.razorpay.com",
			"https://browser.sentry-cdn.com"
		],
		methods: "GET,POST,PUT,DELETE",
		credentials:true,
	})
)

app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)

//cloudinary connection
cloudinaryConnect();

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

const path = require('path');

// Serve static files from the React app (frontend build)
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Catch-all route to serve the frontend's index.html for client-side routing
// This must come AFTER all API routes and static file serving
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})
