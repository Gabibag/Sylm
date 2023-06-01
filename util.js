let invaildChars = ["'", '"', '`', ' ', ";", ":", ",", ".", "/", "\\", "|", "[", "]", "{", "}", "(", ")", "="];
module.exports = {
    separator: "",
    espace: function (str) {
        const r = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;'
        };
        return str.replace(/[&<>]/g, function (m) {
            return r[m] || m;
        }
        );
    },
    strToNum : function(str) {
        let num = 0;
        for (let i = 0; i < str.length; i++) {
          num += str.charCodeAt(i);
        }
        return num;
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
        const cookie = req.headers.cookie;
        return cookie.split('; ');
    },
};