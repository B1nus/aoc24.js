const fs = require("node:fs");
const data = fs.readFileSync("12.txt", "utf8");
const width = data.indexOf('\n') + 1;

function all_neighbours(pos, width, len) {
  var neighbours = [];
  if (pos >= width) { neighbours.push(pos - width) }
  if (pos % width != 0) { neighbours.push(pos - 1) }
  if (pos < len - width) { neighbours.push(pos + width) }
  if (pos % width != width - 2) { neighbours.push(pos + 1) }
  return neighbours;
}

var done = {};
var total = 0;
outer: for (let y = 0; y < Math.ceil(data.length / width); y++) {
  for (let x = 0; x < width - 1; x++) {
    const pos = x + y * width;
    const letter = data[pos];
    var area = 0;
    var perimiter = 0;
    if (!(pos in done)) {
      var neighbours = [pos];
      while (neighbours.length > 0) {
        var new_neighbours = [];
        neighbours.forEach(neighbour => {
          if (!(neighbour in done)) {
            done[neighbour] = true;
            area += 1;
            new_neighbours = new_neighbours.concat(all_neighbours(neighbour, width, data.length).filter(pos => data[pos] == letter && !(pos in done)));
            perimiter += 4 - all_neighbours(neighbour, width, data.length).filter(pos => data[pos] == letter).length;
          }
        });
        neighbours = new_neighbours;
      }
      total += area * perimiter;
      console.log(area, perimiter);
    }
  }
}
console.log(total);
