const fs = require("node:fs");
const data = fs.readFileSync("18.txt", "utf8");
const blocks = new Set(data.split('\n').filter(l => l.length > 0).slice(0, 1024).map(l => l.split(',').map(Number)).map(ns => ns[0] + ns[1] * 71));

function dijkstra(blocks) {
  var seen = new Set();
  var agents = [{pos:0,steps:0}];

  while (agents.length > 0) {
    const agent = agents.splice(0, 1)[0];

    if (agent.pos == 70 + 70 * 71) {
      return agent.steps;
    } else if (seen.has(agent.pos)) {
      continue;
    } else {
      seen.add(agent.pos);
    }

    const adj = adjacent(agent.pos).filter(pos => !seen.has(pos) && !blocks.has(pos)).forEach(adj => {
      agents.push({pos:adj,steps:agent.steps + 1});
    });

    agents.sort((a, b) => a.steps - b.steps);
  }
  console.log("Error: could not find a path to (70,70)");
}

function adjacent(pos) {
  var adjacent = [];
  if (pos % 71 != 0) { adjacent.push(pos - 1); }
  if (pos % 71 != 70) { adjacent.push(pos + 1); }
  if (pos > 70) { adjacent.push(pos - 71); }
  if (pos < 70 * 71) { adjacent.push(pos + 71); }
  return adjacent;
}

function draw(blocks) {
  for (let y = 0; y < 71; y++) {
    for (let x = 0; x < 71; x++) {
      if (blocks.has(x + y * 71)) {
        process.stdout.write('#');
      } else {
        process.stdout.write('.');
      }
    }
    process.stdout.write('\n');
  }
}

console.log(dijkstra(blocks));
