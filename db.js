
const mongoose = require("mongoose");
async function connectDB() {
    try {
      await mongoose.connect("");
      console.log("MongoDB connected successfully");
    } catch (err) {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    }
  }
  
  connectDB();
  

let UserSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["user", "admin"], default: "user" }
}
)


let usersModel = mongoose.model("users", UserSchema);

let ShowSchema = new mongoose.Schema({
    movieName: String,
    showTime: String,
    ticketPrice: Number,
    availableTickets: Number,
    createdAt: { type: Date, default: Date.now }
}
)


let showsModel = mongoose.model("shows", ShowSchema);

const BookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    showId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shows",
        required: true
    },
    seats: {
        type: Number,
        required: true,
        min: 1
    },
    totalAmount: {
        type: Number,
        required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now
    }
});

let bookingsModel = mongoose.model("bookings", BookingSchema);

module.exports = {
    usersModel, bookingsModel, showsModel
}