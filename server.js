var app = require("./index");


// set port, listen for requests
const PORT = process.env.PORT || 3000;
const IP = process.env.IP || "localhost";

// then start listening
app.listen(PORT, function (error) {
    if (error) {
        console.error("Unable to listen for connections", error);
        process.exit(10);
    }
    console.info(
        "Server is listening on http://" +
        IP +
        ":" +
        PORT
    );
});