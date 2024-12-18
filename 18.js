const fs = require("node:fs");
const data = fs.readFileSync("18.txt", "utf8");
const all_blocks = data.split('\n').filter(l => l.length > 0).map(l => l.split(',').map(Number));

function has_path(blocks) {
  var seen = new Set();
  var agents = [{pos:0,steps:0}];

  while (agents.length > 0) {
    const agent = agents.splice(0, 1)[0];

    if (agent.pos == 70 + 70 * 71) {
      return true;
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
  draw(blocks, seen);
  return false;
}

function adjacent(pos) {
  var adjacent = [];
  if (pos % 71 != 0) { adjacent.push(pos - 1); }
  if (pos % 71 != 70) { adjacent.push(pos + 1); }
  if (pos > 70) { adjacent.push(pos - 71); }
  if (pos < 70 * 71) { adjacent.push(pos + 71); }
  return adjacent;
}

function draw(blocks, seen) {
  for (let y = 0; y < 71; y++) {
    for (let x = 0; x < 71; x++) {
      if (blocks.has(x + y * 71)) {
        process.stdout.write('#');
      } else if (seen.has(x + y * 71)) {
        process.stdout.write('O')
      } else {
        process.stdout.write('.');
      }
    }
    process.stdout.write('\n');
  }
}

for (let bytes = 1024; bytes <= all_blocks.length; bytes++) {
  const blocks = new Set(all_blocks.slice(0,bytes).map(ns => ns[0] + ns[1] * 71));
  if (!has_path(blocks)) {
    console.log(all_blocks[bytes - 1][0].toString().concat(',').concat(all_blocks[bytes - 1][1].toString()));
    break;
  }
}

