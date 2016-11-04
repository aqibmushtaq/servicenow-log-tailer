var request = require("request");
var parseString = require('xml2js').parseString;
var querystring = require('querystring');
var zlib = require('zlib');
var properties = require('./properties');
var args = process.argv.slice(2);

var cookiesArr = [];
for (var cookieName in properties['cookie']) {
    cookiesArr.push(cookieName+'='+properties['cookie'][cookieName]);
}
var cookiesStr = cookiesArr.join('; ');

var options = {
    method: 'POST',
    url: properties.host + '/xmlhttp.do',
    headers:
    {
        'Accept-Encoding':'gzip, deflate, br',
        'Accept-Language':'en-US,en;q=0.8,en-GB;q=0.6',
        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie':cookiesStr,
        'X-UserToken': properties.sessionToken,
    }
};
var form = {
    'ni.nolog.x_referer'            : 'ignore',
    'sysparm_express_transaction'   : 'true',
    'sysparm_name'                  : 'logtail',
    'sysparm_processor'             : 'ChannelAjax',
    'sysparm_scope'                 : 'global',
    'sysparm_silent_request'        : 'true',
    'sysparm_type'                  : 'read',
    'sysparm_value'                 : '',
    'sysparm_want_session_messages' : 'true',
    'x_referer'                     : 'channel.do?sysparm_channel=logtail'
};

function printLogs(logs) {
    parseString(logs, function (err, result) {
        form.sysparm_value = result['xml']['$']['channel_last_sequence'];
        var logs = result['xml']['item'];
        logs.forEach((log) => {
            console.log(log['$']['message']);
        });
        getLogs();
    });
}
function getLogs() {
    var formData = querystring.stringify(form);
    var contentLength = formData.length;
    options['headers']['Content-Length'] = contentLength;
    options['body'] = formData;

    var response = request(options);
    var gunzip = zlib.createGunzip();
    var logs = "";
    gunzip.on('data', function(data){
        logs += data.toString();
    });
    gunzip.on('end', function(){
        printLogs(logs)
    });
    response.pipe(gunzip);
}
getLogs();
