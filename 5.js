const fs = require("node:fs");
const data = fs.readFileSync("5.txt", "utf8");

const split = data.split("\n\n");
const rules = split[0].split('\n').map(line => line.split('|').map(num => Number(num)));
const updates = split[1].split("\n").filter((l) => l.length > 0).map((line) => line.split(',').map((num) => Number(num)));

function check_validity(update, rules) {
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    if (update.includes(rule[0]) && update.includes(rule[1])) {
      const index1 = update.indexOf(rule[0]);
      const index2 = update.indexOf(rule[1]);
      if (index1 > index2) {
        return [index1, index2];
      }
    }
  }
  return null;
}

var count = 0;
left = updates.forEach(update => {
  var validity = check_validity(update, rules);

  if (validity != null) {
    while (validity != null) {
      [i1, i2] = validity;
      [update[i1], update[i2]] = [update[i2], update[i1]];
      validity = check_validity(update, rules);
    }
    count += update[Math.floor(update.length / 2)];
  }
});

console.log(count);
