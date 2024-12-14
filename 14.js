const fs = require("node:fs");
const data = fs.readFileSync("14.txt", "utf8");
const [width, height, seconds] = [101,103, 100];
var quadrent_counts = [0,0,0,0];
const lines = data.split('\n').filter(line => line.length > 0).map(line => {
  var [x, y] = line.slice(2, line.indexOf(' ')).split(',').map(Number);
  const [vx, vy] = line.slice(line.indexOf('v') + 2, line.length).split(',').map(Number);   for (let i = 0; i < seconds; i++) {
    x += vx;
    y += vy;
    if (x < 0) {x = x % width + width} else {x = x % width};
    if (y < 0) {y = y % height + height} else {y = y % height};
  }
  const [mid_x, mid_y] = [width / 2, height / 2].map(Math.floor);
  if (x < mid_x && y < mid_y) {
    quadrent_counts[0] += 1;
  } else if (x > mid_x && y < mid_y) {
    quadrent_counts[1] += 1;
  } else if (x > mid_x &&  y > mid_y) {
    quadrent_counts[2] += 1;
  } else if (x < mid_x && y > mid_y) {
    quadrent_counts[3] += 1;
  }
  return [x, y];
});

var prod = 1;
quadrent_counts.forEach(n => {
  prod *= n;
});
console.log(prod);
