var express = require("express");
var app = express();

var presto = require("./lib/presto.js");
app.get(presto.path, presto.func);

app.listen(11100);