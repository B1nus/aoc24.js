const fs = require("node:fs");
const data = fs.readFileSync("20.txt", "utf8");
const map = data.split('').filter(c => c != '\n');
const start = map.indexOf('S');
const end = map.indexOf('E');
const width = data.indexOf('\n');
const normal_time = map.filter(c => c == '.').length + 1;
const time_to_save = Number(process.argv[2]);

const dijkstra_map = dijkstras_map(map, width);
console.log("Day 20 >>", good_cheats(map, width, dijkstra_map));

// A map of the distance to the goal from each position
function dijkstras_map(map, width) {
  var pos = start;
  var ns = 0;
  var seen = {};

  while (pos != end) {
    seen[pos] = normal_time - ns;
    pos = adjacent(map, width, pos).filter(adj => !(adj in seen))[0];
    ns += 1;
  }

  seen[end] = 0;

  return seen;
}

function good_cheats(map, width, dijkstra_map) {
  var good_cheats = 0;

  for (let key in dijkstra_map) {
    const time = normal_time - dijkstra_map[key];
    // draw_map(map, width, Number(key));
    // console.log("at", key, "with time", time);
    cheats(map, width, Number(key)).forEach(cheat => {
      const final_time = dijkstra_map[cheat] + time + 2;
      // console.log("\tcheat", cheat, "cheat time", final_time);
      if (normal_time - final_time >= time_to_save) {
        // console.log("\t\t[GOOD!]");
        good_cheats += 1;
      }
    });
  }

  return good_cheats;
}

function draw_map(map, width, pos) {
  for (let y = 0; y < map.length / width; y ++) {
    for ( let x = 0; x < width; x ++) {
      if (pos == x + y * width) {
      process.stdout.write("O");
      } else {
      process.stdout.write(map[x + y * width]);
      }
    }
    process.stdout.write('\n');
  }
}

// Finds all adjacent positions
function adjacent(map, width, pos) {
  var adjacent = [];
  if (pos % width != 0) { adjacent.push(pos - 1); }
  if (pos % width != width - 1) { adjacent.push(pos + 1); }
  if (pos > width - 1) { adjacent.push(pos - width); }
  if (pos < width * width - width) { adjacent.push(pos + width); }
  return adjacent.filter(adj => map[adj] == '.' || map[adj] == 'E');
}

// Finds all positions two steps away in each direction
function cheats(map, width, pos) {
  var cheats = [];
  if (pos % width > 1 && map[pos - 1] == '#') { cheats.push(pos - 2); }
  if (pos % width < width - 2 && map[pos + 1] == '#') { cheats.push(pos + 2); }
  if (pos > 2 * width - 1 && map[pos - width] == '#') { cheats.push(pos - 2 * width); }
  if (pos < width * width - 2 * width && map[pos + width] == '#') { cheats.push(pos + 2 * width); }
  return cheats.filter(cheat => map[cheat] == '.' || map[cheat] == 'E');
}
