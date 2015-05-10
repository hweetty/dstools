var http = require("http");
var Browser = require("zombie");

// Express `get` path
exports.path = "/presto/:cardNum";

// Express `get` callback
exports.func = function (req, res) {
  var cardNum = String(req.params.cardNum);

  // Presto card numbers always have a length of 17
  if (cardNum.length != 17) {
  		res.send({status: 400, message: "Error, card must have 17 digits"});
  		return;
  }

	// Get the request. (HTML elements are taken from Presto login page.)
	browser = new Browser()
	browser.visit("https://www.prestocard.ca/en-US/Pages/TransactionalPages/AccountLogin.aspx", function () {
		browser.
	    fill("#ctl00_SPWebPartManager1_AccountLoginWebpartControl_ctl00_webpartAnonymousUserLogin_ctl00_textboxAnonymousLogin", cardNum).
	    pressButton("#ctl00_SPWebPartManager1_AccountLoginWebpartControl_ctl00_webpartAnonymousUserLogin_ctl00_buttonSubmit", function() {
	      // See if login was successful (in which case there would be a balance)
	      var balance = browser.html("#ctl00_SPWebPartManager1_AFMSCardSummaryWebpart_ctl00_wizardCardSummary_labelDisplayBalance");
	      if (!balance || typeof balance !== 'string') {
	      	res.send({status: 400, message: "Error, invalid card number"});
	      	browser.then(done, done);
	      	return;
	      }

	      var regex = /\$[0-9.]*/
	      var money = balance.match(regex)[0];

	      // Create and send the response
	      var html =
			"<html><head><meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0'/> \
			<title>_money_</title></head> \
			<body style='margin:0;'><center> \
			<h1 style='font-size:25px; margin-top: 22px'>_money_</h1> \
			<p style='font-size:20px;'>_card_</p> \
			<div style='position:absolute; bottom:0; width:80%; margin:0 10%'> \
			<a style='color:purple; font-size:16px;' target='_blank' href='https://github.com/hweetty/dstools'>Source available on Github!</a> \
			<p style='font-size:14; color:gray;'>Disclaimer: Your connection to this site is not over TLS and your information is sent in the clear.</p> \
			</div> \
			</center></body></html>";
	    	html = html.replace (/_money_/g, money);
	    	html = html.replace (/_card_/g, cardNum);
	    	res.send(html);

	      browser.visit("https://www.prestocard.ca/en-US/Pages/Logout.aspx");
	      browser.then(done, done);
	    });
	});
}
