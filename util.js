let invaildChars = ["'", '"', '`', ' ', ";", ":", ",", ".", "/", "\\", "|", "[", "]", "{", "}", "(", ")", "="];
module.exports = {
    separator: "",
    espace: function (str) {
        var r = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;'
        };
        return str.replace(/[&<>]/g, function (m) {
            return r[m] || m;
        }
        );
    },
    getAllCookieDict: function (req) {
        let cookies = this.getAllCookies(req);
        let cookieObj = {};
        for (let c of cookies) {
            let split = c.split('=');
            cookieObj[split[0]] = split[1];
        }
        return cookieObj;
    },
    //as a string
    getAllCookies: function (req) {
        var cookie = req.headers.cookie;
        return cookie.split('; ');
    },
};