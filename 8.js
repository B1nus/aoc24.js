const fs = require("node:fs");
const data = fs.readFileSync("8.txt", "utf8");
const width = data.indexOf('\n') + 1;

var positions = {};
for (let i = 0; i < data.length; i++) {
  const c = data[i];
  if (c != '.' && c != '\n') {
    pos = [i % width, Math.floor(i/width)];
    if (c in positions) {
      positions[c].push(pos)
    } else {
      positions[c] = [pos];
    }
  }
}

function in_range(pos, width, len) {
  return pos[0] >= 0 && pos[1] >= 0 && pos[0] < width - 1 && pos[1] < Math.ceil(len / width);
}

var antinodes = new Set;
for (let key in positions) {
  const list = positions[key];
  for (let i = 0; i < list.length - 1; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const dx = list[i][0] - list[j][0];
      const dy = list[i][1] - list[j][1];
      if (in_range([list[j][0] + dx * 2, list[j][1] + dy * 2], width, data.length)) {
        antinodes.add((list[j][0] + dx * 2).toString().concat(',').concat((list[j][1] + dy * 2).toString()));
      }
      if (in_range([list[i][0] - dx * 2, list[i][1] - dy * 2], width, data.length)) {
        antinodes.add((list[i][0] - dx * 2).toString().concat(',').concat((list[i][1] - dy * 2).toString()));
      }
      console.log(list[i], list[j]);
    }
  }
}

console.log(antinodes.size);
