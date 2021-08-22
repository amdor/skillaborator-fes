const express = require("express");
const app = express();
const path = require("path");
const compression = require("compression");

const forceSSL = function () {
  return function (req, res, next) {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect(["https://", req.get("Host"), req.url].join(""));
    }
    next();
  };
};

app.use(compression());
// ForceSSL middleware
app.use(forceSSL());
app.use(express.static(__dirname + "/dist"));

const port = process.env.PORT || 8080;
app.listen(port);
console.log("app listening on " + port);

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/index.html"));
});
