const fs = require("node:fs");
const data = fs.readFileSync("7.txt", "utf8");
const lines = data.split('\n').filter(l => l.length > 0);

var sum = 0;
lines.forEach(line => {
  lhs = Number(line.slice(0,line.indexOf(':')));
  rhs = line.slice(line.indexOf(':') + 2,line.length).split(' ').map(Number);
  for (let i = 0; i < Math.pow(2, rhs.length - 1); i++) {
    result = rhs[0];
    for (let n = 0; n < rhs.length- 1; n++) {
      if ((i >> n) & 1 == 1) {
        result *= rhs[n + 1];
      } else {
        result += rhs[n + 1];
      }
    }
    if (result == lhs) {
      sum += result;
      break;
    }
  }
});

console.log(sum);
