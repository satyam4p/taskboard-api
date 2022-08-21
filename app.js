const express = require('express');

const app = express();

const port = 9000;

app.get('/',(req, res)=>{
    res.send('taskboard api');
})

app.listen(port,()=>{
    console.log(`api is running on port ${port}`);
});

module.exports = app;