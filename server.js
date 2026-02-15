const app = require("./app.js");
const connectDB = require("./config/db.js");

require("dotenv").config();

connectDB();

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port number ${PORT}`));
