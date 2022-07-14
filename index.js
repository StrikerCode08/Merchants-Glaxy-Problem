const fs = require('fs');
const readline = require('readline')
const Main = require('./mainHelp.js')

const Read = readline.createInterface({
    input: fs.createReadStream('./input.txt'),
    terminal : false
})

Read.on('line', function (line) {
    Main.Merchant(line.trim())
})

process.on('uncaughtException', function (err) {
    console.log(err);
})