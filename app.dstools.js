var express = require("express");
var app = express();

var toolPaths = [
	"./lib/presto.js", 	// Presto Card
	"./lib/watcard.js",	// uWaterloo WatCard
]

toolPaths.forEach(function (path) {
	var tool = require(path);
	app.get(tool.path, tool.func);
});

app.listen(11100);