const fs = require('fs');
const files = fs.readdirSync('./src/lib/converters');
console.log(files.join('\n'));
