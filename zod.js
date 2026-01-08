const z = require("zod");

const signupSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
    role: z.enum(["user", "admin"]).optional()
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

const showSchema = z.object({
    movieName: z.string(),
    showTime: z.string(),
    ticketPrice: z.number(),
    availableTickets: z.number(),

});

const bookingSchema = z.object({
        showId:z.string() ,
        seats: z.number()
      
})
module.exports = {signupSchema,loginSchema,showSchema,bookingSchema};
