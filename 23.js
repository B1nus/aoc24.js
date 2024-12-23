const fs = require("node:fs");
const connections = fs.readFileSync("23.txt", "utf8").split('\n').filter(l => l.length > 0).map(l => l.split('-'));
var map = {};

connections.forEach(conn => {
  if (conn[0] in map) {
    map[conn[0]].add(conn[1]);
  } else {
    map[conn[0]] = new Set([conn[1]]);
  }

  if (conn[1] in map) {
    map[conn[1]].add(conn[0]);
  } else {
    map[conn[1]] = new Set([conn[0]]);
  }
});

var max = 0;
var max_set = undefined;
for (var computer in map) {
  const same_array = Array.from(map[computer]);
  for (let i = 0; i < Math.pow(2, map[computer].size); i++) {
    var same = new Set(same_array);
    same_array.forEach((other, index) => {
      if (((i >> index) & 1) == 1) {
        same = new Set([...map[other],...[other]].filter(l => same.has(l)));
      } else {
        same = new Set([...same].filter(l => l != other));
      }
    });
    if (same.size > max) {
      max = same.size;
      max_set = new Set([...same, ...[computer]]);
    }
  }
}
console.log([...max_set].sort().toString());

