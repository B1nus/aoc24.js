const fs = require("node:fs");
const data = fs.readFileSync("16.txt", "utf8");
const width = data.indexOf('\n');
const map = data.split('').filter(c => c != '\n');

function fun_dijkstras(map, width) {
  const start = map.indexOf('S');
  const end = map.indexOf('E');
  var agents = [{ pos: start, dir: 3, cost: 0 }];
  var seen = {};
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', key => {
    if (key[0] == 3) {
      process.exit(0);
    }
    console.log('\x1b[2J\x1b[H');

    const agent = agents.splice(0, 1)[0];
    console.log(agent);
    if (agent.pos == end) {
      console.log(agent.cost);
    }

    const adjacent = empty_adjacent(map, width, agent.pos);
    adjacent.forEach(adj => {
      const adj_hash = adj.pos.toString().concat(' ').concat(adj.dir.toString());
      if (adj.dir == agent.dir) {
        push_if_new(agents, seen, { pos: adj.pos, dir: adj.dir, cost: agent.cost + 1 });
      } else if (is_turnable(agent.dir, adj.dir)) {
        push_if_new(agents, seen, { pos: adj.pos, dir: adj.dir, cost: agent.cost + 1001 });
      }
    });

    agents.sort((a, b) => a.cost - b.cost);

    draw_agents(map, width, agents);
  });
}

function dijkstras(map, width) {
  const start = map.indexOf('S');
  const end = map.indexOf('E');
  var agents = [{ pos: start, dir: 3, cost: 0 }];
  var seen = {};
  while (agents.length > 0) {
    const agent = agents.splice(0, 1)[0];
    if (agent.pos == end) {
      return agent.cost;
    }

    const adjacent = empty_adjacent(map, width, agent.pos);
    adjacent.forEach(adj => {
      const adj_hash = adj.pos.toString().concat(' ').concat(adj.dir.toString());
      if (adj.dir == agent.dir) {
        push_if_new(agents, seen, { pos: adj.pos, dir: adj.dir, cost: agent.cost + 1 });
      } else if (is_turnable(agent.dir, adj.dir)) {
        push_if_new(agents, seen, { pos: adj.pos, dir: adj.dir, cost: agent.cost + 1001 });
      }
    });

    agents.sort((a, b) => a.cost - b.cost);
  }
}

function hash_agent(agent) {
    return agent.pos.toString().concat(' ').concat(agent.dir.toString());
}

function push_if_new(agents, seen, new_agent) {
  const new_agent_hash = hash_agent(new_agent);
  if (!(new_agent_hash in seen)) {
    agents.push(new_agent);
    seen[new_agent_hash] = new_agent.cost;
  } else if (agents.cost < seen[new_agent_hash].cost) {
    agents = agents.filter(agent => agent.pos == new_agent.pos && agent.dir == new_agent.dir);
    agents.push(new_agent);
    seen[new_agent_hash] = new_agent.cost;
  }
}

function draw_agents(map, width, agents) {
  for (let y = 0; y < map.length / width; y++) {
    for (let x = 0; x < width; x++) {
      const pos = x + y * width;
      if (agents.filter(agent => agent.pos == pos).length > 0) {
        if (agents[0].pos == pos) {
          process.stdout.write('X');
        } else {
          process.stdout.write('x');
        }
      } else {
        process.stdout.write(map[pos]);
      }
    }
    process.stdout.write('\n');
  }
}

function is_turnable(dir, target_dir) {
  return target_dir == (dir + 1) % 4 || target_dir == ((dir - 1) % 4 + 4) % 4;
}

function empty_adjacent(map, width, pos) {
  var adj = [];
  for (var d = 0; d < 4; d++) {
    const adj_index = pos + direction_delta(d, width);
    if (map[adj_index] == '.' || map[adj_index] == 'E') {
      adj.push({ pos: adj_index, dir: d });
    }
  }
  return adj;
}

// In order of WASD. 0 => up, 1 => left, 2 => down, 3 => right.
function direction_delta(direction, width) {
  switch (direction) {
    case 0:
      return - width;
    case 1:
      return - 1;
    case 2:
      return width;
    case 3:
      return 1;
  }
}

// fun_dijkstras(map, width);
console.log(dijkstras(map, width));
