const express = require('express');
const path = require('path');

const app = express();
const PORT = 8091;

app.get('/', (req, res) => { 
     res.sendFile(path.join(__dirname, 'public/templates/index.html'))
})



app.listen(PORT, () => { 
    console.info('Server is listening on port:\t' + PORT);
})