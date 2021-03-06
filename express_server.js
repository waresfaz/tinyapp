const express = require("express");
const cookieParser = require('cookie-parser');
const app = express()
app.use(cookieParser())
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs')

function generateRandomString() {
  let result = '';
  let chars = '1234567890abcdefghijklmnopqrstuvwxyz'
  
  for (let i = 0; i <= 5; i++) {
    let gen = Math.floor(Math.random() * (36 - 0) + 0);
    result += chars[gen]
  }
return result;
}


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.send(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
});

app.get("/urls", (req, res) => {
  let templateVars = { username: req.cookies["username"], 
  urls: urlDatabase }
  res.render("urls_index", templateVars)
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  let random = generateRandomString();
  urlDatabase[random]=req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${random}`);
});

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls")
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"]
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { username: req.cookies["username"],
  shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls")
});

app.post("/urls/:shortURL", (req, res) => {
  console.log(req.params)
  console.log(req.body)
  urlDatabase[req.params.shortURL]=req.body.updateLongURL
  res.redirect("/urls")
});

// app.get("/logout", (req, res) => {
//   res.clearCookie("username", { path: "/login"})
//   res.redirect("/urls")
// });

app.post("/logout", (req, res) => {
  console.log(req.cookies)
  res.clearCookie("username", req.body.username)
  console.log(req.cookies)
  res.redirect("/urls")
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
