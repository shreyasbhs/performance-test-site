const express = require('express');
const crypto = require('crypto');
const nunjucks = require('nunjucks');
const fs = require('fs');
const https = require('https');
const path = require('path');

const app = express();
const PORT = 8091;
const SSL_PORT = 443;

//Change the default views directory

const privateKey = fs.readFileSync('/etc/letsencrypt/live/dctauto.shreyasbhs.in/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/dctauto.shreyasbhs.in/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/dctauto.shreyasbhs.in/chain.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};



nunjucks.configure('public/templates', {
    autoescape: true, // Enable autoescaping for security
    express: app,     // Integrate with Express for context variables
    watch: true,     // Watch for template changes and reload automatically

});


app.set('view engine', 'nunjucks');

// app.use(express.static(__dirname, { dotfiles: 'allow' }));

app.get('/', (req, res) => { 
    const allowedDomains = "*.cloudfront.net assets-global.website-files.com cdnjs.cloudflare.com cdnjs.cloudflare.com *.webformscr.com amosk.com.ua"
    const nonce = crypto.randomBytes(16).toString('base64');
    res.set(`Content-Security-Policy`, `script-src ${allowedDomains} 'nonce-${nonce}'`)
    data = {
        "nonce": nonce
    }
    res.render('index',data)
})



app.listen(PORT, () => {
    console.info('Server is listening on port:\t' + PORT);
});



const httpsServer = https.createServer(credentials, app);

httpsServer.listen(SSL_PORT, () => {
    console.log('HTTPS Server running on port:\t', SSL_PORT);
});