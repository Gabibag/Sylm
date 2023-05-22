const db = require('./db.js');
const fs = require('fs');
async function run() {
    await db.init();
    let file = fs.readFileSync('./setData.txt', 'utf8');
    let sets = file.split('\n');
    for (let set of sets) {
        let name = set.split(',')[0];
        let desc = set.split(',')[1];
        let author = set.split(',')[2];
        let terms = set.split(',')[3].replaceAll('%', '');
        let defs = set.split(',')[4].replaceAll('%', '');
        db.createSetManual(name, desc, author, terms, defs);
    }
}
run()