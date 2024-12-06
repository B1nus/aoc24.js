const fs = require("node:fs");
const data = fs.readFileSync("6.txt", "utf8");

const size = data.indexOf('\n') + 1;
const pos = data.indexOf('^');


// Brute force pog
var count = 0;
for (let i = 0; i < size - 1; i++) {
  for (let j = 0; j < size - 1; j++) {
    if (data[i * size + j] == '#' || data[i * size + j] == '^') {
      continue;
    }
    const visited = new Set();
    var x = pos % size;
    var y = Math.floor(pos / size);
    var d = 0; // wdsa
    while (x > 0 && x < size - 1 && y > 0 && y < size - 1) {
      const string = x.toString() + ',' + y.toString() + ',' + d.toString();
      if (visited.has(string)) {
        count += 1;
        break;
      }
      visited.add(string);
      if (d == 0) {
        if (data[x + (y - 1) * size] != '#' && !(x == j && y - 1 == i)) {
          y -= 1;
        } else {
          d = 1;
        }
      } else if (d == 1) {
        if (data[x + 1 + y * size] != '#' && !(x + 1 == j && y == i)) {
          x += 1;
        } else {
          d = 2;
        }
      } else if (d == 2) {
        if (data[x + (y + 1) * size] != '#' && !(x == j && y + 1 == i)) {
          y += 1;
        } else {
          d = 3;
        }
      } else if (d == 3) {
        if (data[(x - 1) + y * size] != '#' && !(x - 1 == j && y == i)) {
          x -= 1;
        } else {
          d = 0;
        }
      }
    }
  }
}

console.log(count);
