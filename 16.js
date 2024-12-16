const fs = require("node:fs");
const data = fs.readFileSync("16.txt", "utf8");
const width = data.indexOf('\n');
const map = data.split('').filter(c => c != '\n');

function fun_dijkstras(map, width) {
  const start = map.indexOf('S');
  const end = map.indexOf('E');
  var agents = [{ pos: start, dir: 3, cost: 0, path: new Set }];
  var seen = {};
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', key => {
    if (key[0] == 3) {
      process.exit(0);
    }
    console.log('\x1b[2J\x1b[H');

    const agent = agents.splice(0, 1)[0];
    agent.path.add(agent.pos);

    const adjacent = empty_adjacent(map, width, agent.pos);
    adjacent.forEach(adj => {
      const adj_hash = adj.pos.toString().concat(' ').concat(adj.dir.toString());
      if (adj.dir == agent.dir) {
        push_if_new(agents, seen, { pos: adj.pos, dir: adj.dir, cost: agent.cost + 1, path: new Set(agent.path) });
      } else if (is_turnable(agent.dir, adj.dir)) {
        push_if_new(agents, seen, { pos: adj.pos, dir: adj.dir, cost: agent.cost + 1001, path: new Set(agent.path) });
      }
      // console.log("last list afterward", agents[agents.length - 1]);
    });

    agents.sort((a, b) => a.cost - b.cost);

    draw_agents(map, width, agents);
  });
}

function find_best_spots(map, width) {
  const start = map.indexOf('S');
  const end = map.indexOf('E');
  var agents = [{ pos: start, dir: 3, cost: 0, path: new Set([start]) }];
  var seen = {};
  var min_cost = null;
  var best_paths_pos = new Set;
  while (agents.length > 0) {
    const agent = agents.splice(0, 1)[0];
    if (agent.pos == end) {
      if (min_cost == null) {
        min_cost = agent.cost;
        agent.path.forEach(pos => { best_paths_pos.add(pos) });
      } else if (min_cost == agent.cost) {
        agent.path.forEach(pos => { best_paths_pos.add(pos) });
      }
      continue;
    }
    if (min_cost != null && agent.cost > min_cost) {
      continue;
    }
    agent.path.add(agent.pos);

    const adjacent = empty_adjacent(map, width, agent.pos);
    adjacent.forEach(adj => {
      const adj_hash = adj.pos.toString().concat(' ').concat(adj.dir.toString());
      if (adj.dir == agent.dir) {
        push_if_new(agents, seen, { pos: adj.pos, dir: adj.dir, cost: agent.cost + 1, path: new Set(agent.path) });
      } else if (is_turnable(agent.dir, adj.dir)) {
        push_if_new(agents, seen, { pos: adj.pos, dir: adj.dir, cost: agent.cost + 1001, path: new Set(agent.path) });
      }
    });
    agents.sort((a, b) => a.cost - b.cost);

    // draw_agents(map, width, agents);
  }
  draw_best_spots(map, width, best_paths_pos);
  return best_paths_pos.size + 1;
}

function hash_agent(agent) {
  return agent.pos.toString().concat(' ').concat(agent.dir.toString());
}

function push_if_new(agents, seen, new_agent) {
  const new_agent_hash = hash_agent(new_agent);
  // console.log(seen);

  if (new_agent_hash in seen) {
    if (new_agent.cost > seen[new_agent_hash].cost) {
      return;
    }
    agents.splice(0, agents.length, ...agents.filter(agent => agent.pos != new_agent.pos || agent.dir != new_agent.dir));
    if (new_agent.cost == seen[new_agent_hash].cost) {
      seen[new_agent_hash].path.forEach(pos => { new_agent.path.add(pos) });
    }
  }
  agents.push({ ...new_agent, path: new Set(new_agent.path) });
  seen[new_agent_hash] = { ...new_agent, path: new Set(new_agent.path) };
}

function draw_best_spots(map, width, best_spots) {
  for (let y = 0; y < map.length / width; y++) {
    for (let x = 0; x < width; x++) {
      const pos = x + y * width;
      if (best_spots.has(pos)) {
        process.stdout.write('\x1b[1mO\x1b[0m');
      } else {
        process.stdout.write(map[pos]);
      }
    }
    process.stdout.write('\n');
  }
}

function draw_agents(map, width, agents) {
  console.log(agents);
  for (let y = 0; y < map.length / width; y++) {
    for (let x = 0; x < width; x++) {
      const pos = x + y * width;
      if (agents.length > 0 && agents[0].path.has(pos)) {
        process.stdout.write('o');
      } else if (agents.filter(agent => agent.pos == pos).length > 0) {
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
console.log(find_best_spots(map, width));
