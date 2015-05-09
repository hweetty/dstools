var querystring = require('querystring');
var http = require('https');

// Express `get` path
exports.path = "/watcard/:cardNum/:password";

// Express `get` callback
exports.func = function (req, res) {
  var cardNum = req.params.cardNum;
  var password = req.params.password;

  // Build the post string to an object
  var post_data = querystring.stringify({
    "acnt_1":cardNum,
    "acnt_2":password,
    // Not sure which other params are needed, so just include them all...
    "FINDATAREP":"ON",
    "MESSAGEREP":"ON",
    "qdate":"-not needed-",
    "STATUS":"STATUS",
    "watgopher_title":"WatCard Account Status",
    "watgopher_regex":"/<hr>([\s\S]*)<hr>/;",
    "watgopher_style":"onecard_regular",
  });


  // An object of options to indicate where to post to
  var post_options = {
      host: 'account.watcard.uwaterloo.ca',
      port: '443',
      path: '/watgopher661.asp',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': post_data.length
      }
  };

  // Set up the request
  var data = "";
  var post_req = http.request(post_options, function(result) {
      result.setEncoding('utf8');
      result.on('data', function (chunk) {
        data += chunk;
      });

      result.on("end", function () {
        var regex = /\$[ 0-9.]+/
        var money = data.match(regex)[0];
        money = money.replace(/[^0-9.]*/, ""); // Get rid of extra spaces
        // Send the response
        var html =
        "<html><head><meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0'/> \
         <title>_money_</title></head> \
         <center> \
         <h1 style='font-size:25px; margin-top: 22px'>$_money_</h1> \
         <p style='font-size:20px;'>_card_</p> \
         <a style='color:gray; font-size:14px;' target='_blank' href='https://github.com/hweetty/dstools'>Source available on Github!</a> \
         </center></html>";
        html = html.replace (/_money_/g, money);
        html = html.replace (/_card_/g, cardNum);
        res.send(html);
      });
  });

  // post the data
  post_req.write(post_data);
  post_req.end();
}
