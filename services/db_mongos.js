
const mongoose = require("mongoose");
const uri = "mongodb+srv://ombre:<legenieestjohny>@cluster0.uwjnj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(
  uri,
  {
    useNewUrlParser: true,
    // useFindAndModify: false,
    useUnifiedTopology: true
  }
);
module.exports = mongoose;
