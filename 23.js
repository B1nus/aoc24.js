const fs = require("node:fs");
const connections = fs.readFileSync("23.txt", "utf8").split('\n').filter(l => l.length > 0).map(l => l.split('-'));
var groups = new Set;
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

console.log(map);

const part1 = Array.from(new Set(connections.flatMap(connection => {
  const [a, b] = connection;
  return Array
    .from(map[a])
    .filter(l => map[b].has(l))
    .map(l => {
      return connection.concat(l).sort().toString();
    });
}))).map(group => group.split(',').map(l => l[0])).filter(group => group.indexOf('t') != -1).length;

console.log(part1);
