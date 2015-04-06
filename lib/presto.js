var http = require("http");
var Browser = require("zombie");

// Express `get` path
exports.path = "/presto/:cardNum";

// Express `get` callback
exports.func = function (req, res) {
  var cardNum = req.params.cardNum;

  // Assume card number is last 17 digits of url
  if (req.url.length <= 17) {
  		res.send({status: 400, message: "Error, card must have 17 digits"});
  		return;
  }

  // Get the request. HTML elements are taken from login page.
	browser = new Browser()
	browser.visit("https://www.prestocard.ca/en-US/Pages/TransactionalPages/AccountLogin.aspx", function () {
		browser.
	    fill("#ctl00_SPWebPartManager1_AccountLoginWebpartControl_ctl00_webpartAnonymousUserLogin_ctl00_textboxAnonymousLogin", "31240102581783007").
	    pressButton("#ctl00_SPWebPartManager1_AccountLoginWebpartControl_ctl00_webpartAnonymousUserLogin_ctl00_buttonSubmit", function() {
	      var balance = browser.html("#ctl00_SPWebPartManager1_AFMSCardSummaryWebpart_ctl00_wizardCardSummary_labelDisplayBalance");
	      var regex = /\$[0-9.]*/
	      var money = balance.match(regex)[0];

	      // Send the response
	      var html =
      	"<html><head><meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0'/> \
	       <title>_money_</title></head> \
	       <center> \
	       <h1 style='font-size:25px; margin-top: 22px'>_money_</h1> \
	       <p style='font-size:20px;'>_card_</p> \
	       </center></html>";
	    	html = html.replace (/_money_/g, money);
	    	html = html.replace (/_card_/g, cardNum);
	    	res.send(html);

	      browser.visit("https://www.prestocard.ca/en-US/Pages/Logout.aspx");
	      browser.then(done, done);
	    });
	});
}
