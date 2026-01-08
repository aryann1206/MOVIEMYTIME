let express = require("express");
let {router}= require("./users");
let app = express();
app.use(express.json());
app.listen(3000);
app.use("/movie",router);