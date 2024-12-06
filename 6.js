const fs = require("node:fs");
const data = fs.readFileSync("6.txt", "utf8");

const size = data.indexOf('\n') + 1;
const pos = data.indexOf('^');
var x = pos % size;
var y = Math.floor(pos / size);
var d = 0; // wdsa

const visited = new Set([x.toString() + ',' + y.toString()]);
while (x > 0 && x < size - 1 && y > 0 && y < size - 1) {
  visited.add(x.toString() + ',' + y.toString());
  console.log(x,y, d);
  if (d == 0) {
    if (data[x + (y - 1) * size] != '#') {
      y -= 1;
    }else {
      d = 1;
    }
  } else if (d == 1) {
    if (data[x + 1 + y * size] != '#') {
      x += 1;
    }else {
      d = 2;
    }
  } else if (d == 2) {
    if (data[x + (y + 1) * size] != '#') {
      y += 1;
    }else {
      d = 3;
    }
  } else if (d == 3) {
    if (data[(x - 1) + y * size] != '#') {
      x -= 1;
    }else {
      d = 0;
    }
  }
  visited.add(x.toString() + ',' + y.toString());
}

for (let i = 0; i < size - 1; i ++) {
  var str = "";
  for (let j = 0; j < size - 1; j++) {
    var c = data[j + size * i];
    if (visited.has(j.toString() + ',' + i.toString())) {
      c = 'X';
    }
    if (j == x && i == y) {
      c = 'O';
    }

    str = str.concat(c);
  }
  console.log(str);
}

console.log(visited.size);
