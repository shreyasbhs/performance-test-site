const express = require('express');
const crypto = require('crypto');
const nunjucks = require('nunjucks');
const path = require('path');

const app = express();
const PORT = 8091;

//Change the default views directory


nunjucks.configure('public/templates', {
    autoescape: true, // Enable autoescaping for security
    express: app,     // Integrate with Express for context variables
    watch: true,     // Watch for template changes and reload automatically

});


app.set('view engine', 'nunjucks');
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
})