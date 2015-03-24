/*
 * JS DOM throw an error at parsing onliner pages.
 * In this reasons used fake-jquery library
 */

var http = require("http");
var cheerio = require('cheerio');

var CONSTANTS = {
    PAGE_URL: 'http://catalog.onliner.by/mobile/~fp[smart][0]=ios',
    ELEMENTS_QUERY: 'form[name="product_list"] tr'
};

var _clearText = function (text) {
    return text.replace(/ +/g, ' ');
};

var _loadData = function (callback) {
    http.get(CONSTANTS.PAGE_URL, function (res) {
        var str = '';
        
        res.on("data", function (chunk) {
            str += chunk;
        });
        
        res.on("end", function () {
            callback(null, str);
        });
    }).on('error', callback);
};

var _parsePage = function (html) {
    var $ = cheerio.load(html);
    
    var result = [];
    
    $(CONSTANTS.ELEMENTS_QUERY).each(function (index, element) {
        if ($(element).find('.pname').length == 0) {
            return;
        }

        result.push({
            name: _clearText($(element).find('.pname').text()),
            price: _clearText($(element).find('a.black').text()),
        });
    });

    return result;
};

(function () {
    _loadData(function (err, data) {
        var result = _parsePage(data);

        for (var i = 0; i < result.length; i++) {
            var currentResult = result[i];
            console.log("Model: " + currentResult.name + "\n\r" + "Price: " + currentResult.price + "\n\r\n\r");
        }
    });

})();