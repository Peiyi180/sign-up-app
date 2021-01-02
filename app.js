const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
const https = require("https");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.listen(process.env.PORT || 3000, function(){
  console.log("server is running on port 3000");
})

app.get("/", function(req, res) {

  res.sendFile(__dirname + "/signup.html");

})

app.post("/", function(req, res) {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;
  console.log(firstName, lastName, email);


  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,

        }
      }
    ]

  }

  const jsonData = JSON.stringify(data);
  const url = "https://us7.api.mailchimp.com/3.0/lists/c499bde873";
  const options = {
    method: "POST",
    auth: "pj:77bc9c5a680aa0353e6d902bafdcb628-us7"
  }

  const request = https.request(url, options, function(response){
    console.log(response);

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data",function(data){
      // console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res){
  res.redirect("/");
})

// API
// 77bc9c5a680aa0353e6d902bafdcb628-us7
// id
//c499bde873
