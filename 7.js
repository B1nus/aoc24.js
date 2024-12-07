// For the record: I cheated. I'm not proud of it.
const fs = require("node:fs");
const data = fs.readFileSync("7.txt", "utf8");
const lines = data.split('\n').filter(l => l.length > 0);

var sum = 0;
lines.forEach(line => {
  lhs = Number(line.slice(0, line.indexOf(':')));
  rhs = line.slice(line.indexOf(':') + 2, line.length).split(' ').map(Number);
  for (let i = 0; i < Math.pow(3, rhs.length - 1); i++) {
    result = rhs[0];
    temp = i;
    for (let n = 0; n < rhs.length - 1; n++) {
      // This is the part I cheated to get.
      op = temp % 3;
      temp = Math.floor(temp / 3);
      // End of cheat.
      
      if (op == 0) {
        result = Number(result.toString().concat(rhs[n + 1].toString()));
      } else if (op == 1) {
        result *= rhs[n + 1];
      } else if (op == 2) {
        result += rhs[n + 1];

      }
    }
    if (result == lhs) {
      sum += result;
      return;
    }
  }
});

console.log(sum);
