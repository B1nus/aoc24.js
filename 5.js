const fs = require("node:fs");
const data = fs.readFileSync("5.txt", "utf8");

const split = data.split("\n\n");
const rules = split[0].split('\n').map(line => line.split('|').map(num => Number(num)));
const updates = split[1].split("\n").filter((l) => l.length > 0).map((line) => line.split(',').map((num) => Number(num)));

var count = 0;
left = updates.filter(update => {
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    if (update.includes(rule[0]) && update.includes(rule[1])) {
      if (update.indexOf(rule[0]) > update.indexOf(rule[1])) {
        return false;
      }
    }
  }
  count += update[Math.floor(update.length / 2)]
  return true;
});

console.log(count);
