let express = require("express");
let router = express.Router();
router.use(express.json());
let jwt = require("jsonwebtoken");
let bcrypt = require("bcrypt");
let { usersModel, bookingsModel, showsModel } = require("./db");
let { signupSchema, loginSchema, showSchema } = require("./zod");
let secret = "jguyfghuchkgij;khogl"

router.post("/signup", async (req, res) => {
    try {
        const { success, data } = signupSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                message: "Invalid input"
            });
        }

        const existingUser = await usersModel.findOne({ email: data.email });
        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }
        let hashpass = await bcrypt.hash(data.password, 10);
        data.password = hashpass;
        const user = await usersModel.create(data);

        res.status(201).json({
            message: "Signup successful",
            userId: user._id,
            role: user.role
        });

    } catch (e) {
        res.status(500).json({
            message: "Server error"
        });
        return;
    }
});



router.post("/login", async (req, res) => {
    try {
        const { success, data } = loginSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                message: "email and password are required"
            });
        }

        const existingUser = await usersModel.findOne({ email: data.email });
        let pass = await bcrypt.compare(data.password, existingUser.password)
        if (existingUser && pass == true) {
            let token = jwt.sign({ userId: existingUser._id, role: existingUser.role }, secret);
            res.status(200).json({
                message: "Login successful",
                token: token,
                userId: existingUser._id,
                role: existingUser.role
            });

        }
        else {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }


    } catch (e) {
        res.status(500).json({
            message: "Server error"
        });
        return;
    }

})



function middlwareAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];
        let { userId, role } = jwt.verify(token, secret);
        req.userId = userId;
        req.role = role;
        next();
    }
    catch (e) {
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

}



router.post("/shows", middlwareAuth, async (req, res) => {
    if (req.role != "admin") {
        res.status(403).json({
            message: "Only admin can create shows"
        });
        return;
    }
    try {
        let { success, data } = showSchema.safeParse(req.body);
        if (!success) {
            res.status(400).json({
                message: "movieName, showTime, ticketPrice and availableTickets are required"
            });
            return;
        }

        let show = await showsModel.create(data);
        res.status(201).json({
            message: "Show created successfully",
            showId: show._id
        });
        return;

    }
    catch (e) {
        res.status(500).json({
            message: "Server error"
        });
        return;
    }
})





router.get("/shows", async (req, res) => {
    let shows = await showsModel.find();
    if (shows.length == 0) {
        res.status(404).json({
            message: "no shows"
        });
        return;
    }
    res.status(200).json({
        shows
    });
    return;
})



router.get("/shows/:showId", async (req, res) => {
    try {
        let show = await showsModel.findById(req.params.showId);
        if (!show) {
            res.status(404).json({
                message: "Show not found"
            });
            return;
        }
        res.status(200).json({
            show
        });
        return;
    }
    catch (e) {
        res.status(500).json({
            message: "Server error"
        });
        return;
    }
})


router.post("/bookings",middlwareAuth,async (req,res)=>{
    try{
    if(req.role=="admin"){
        res.status(403).json({
            message: "Admins cannot book tickets"
        });
        return;
        
    }
    }
    catch(e){

    }
})



module.exports={router}