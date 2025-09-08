// server.js file will be used for creation of the server and connecting to the db
import app from "./src/app.js";

// listening to server
app.listen(process.env.PORT,()=>{
    console.log("Server is running at port:", process.env.PORT)
})