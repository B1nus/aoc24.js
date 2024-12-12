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

function count_edges(group, width, len) {
  var edges = 0;
  // Horizontal edges
  for (let y = 0; y < Math.ceil(len / width); y++) {
    var top_edging = false;
    var bot_edging = false;
    for (let x = 0; x < width - 1; x++) {
      const pos = x + y * width;
      if (pos in group) {
        if (pos < width || !((pos - width) in group)) {
          if (!top_edging) { edges += 1;
                    console.log("edge up from", x, y);
}
          top_edging = true;
        } else {
          top_edging = false;
        }
        if (pos > len - width || !((pos + width) in group)) {
          if (!bot_edging) {
            edges += 1;
            console.log("edge down from", x, y);
          }
          bot_edging = true;
        } else {
          bot_edging = false;
        }
      } else {
        bot_edging = false;
        top_edging = false;
      }
    }
  }

  // Vertical edges
  for (let x = 0; x < width - 1; x++) {
    var left_edging = false;
    var right_edging = false;
    for (let y = 0; y < Math.ceil(len / width); y++) {
      const pos = x + y * width;
      if (pos in group) {
        if (pos % width == 0 || !((pos - 1) in group)) {
          if (!left_edging) { edges += 1; 
          console.log("edge left from", x, y);
          }
          left_edging = true;
        } else {
          left_edging = false;
        }
        if (pos % width == width - 2 || !((pos + 1) in group)) {
          if (!right_edging) { edges += 1;
          console.log("edge right from", x, y);}
          right_edging = true;
        } else {
          right_edging = false;
        }
      } else {
        right_edging = false;
        left_edging = false;
      }
    }
  }

  return edges;
}

var done = {};
var total = 0;
outer: for (let y = 0; y < Math.ceil(data.length / width); y++) {
  for (let x = 0; x < width - 1; x++) {
    const pos = x + y * width;
    const letter = data[pos];
    var area = 0;
    if (!(pos in done)) {
      var neighbours = [pos];
      var group = {};
      while (neighbours.length > 0) {
        var new_neighbours = [];
        neighbours.forEach(neighbour => {
          if (!(neighbour in done)) {
            done[neighbour] = true;
            group[neighbour] = true;
            area += 1;
            new_neighbours = new_neighbours.concat(all_neighbours(neighbour, width, data.length).filter(pos => data[pos] == letter && !(pos in done)));
          }
        });
        neighbours = new_neighbours;
      }
      const perimiter = count_edges(group, width, data.length);
      total += area * perimiter;
      console.log(area, perimiter);
    }
  }
}
console.log(total);
