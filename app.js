const express = require('express');
const crypto = require('crypto');
const nunjucks = require('nunjucks');
const fs = require('fs');
const https = require('https');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 80;
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
app.use(express.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => { 
    var experimental = false;
    if (req.query.experimental) { 
        experimental = req.query.experimental == 'on' ? true : false;
    }
    const nonce = crypto.randomBytes(16).toString('base64');
    if (!experimental) {
        const allowedDomains = "*.cloudfront.net assets-global.website-files.com cdnjs.cloudflare.com cdnjs.cloudflare.com *.webformscr.com amosk.com.ua rum-dev-dct-collector.soasta.com"
        
        res.set(`Content-Security-Policy`, `script-src ${allowedDomains} 'nonce-${nonce}'`);
        data = {
            "nonce": nonce
        }
        res.render('index', data)
    }
    else { 
        try {
            var cspHeader = fs.readFileSync(path.join(__dirname, 'headers_metadata/csp.txt'));
            res.set('Content-Security-Policy', cspHeader);
          
        }
        catch (error) { 
            consol.error(error);
        }
        data = {
            "nonce": nonce
        }
        res.render('index', data)
        
    }
    
   
})

app.post('/set-csp', (req, res) => { 
    try {
        const cspHeaderData = res.body;
        fs.writeFileSync('header_metadata/csp.txt', cspHeaderData["content"]);
    }
    catch (error) { 
        console.error(error)
    }
    return res.status(202);
     
})


app.listen(PORT, () => {
    console.info('Server is listening on port:\t' + PORT);
});



const httpsServer = https.createServer(credentials, app);

httpsServer.listen(SSL_PORT, () => {
    console.log('HTTPS Server running on port:\t', SSL_PORT);
});