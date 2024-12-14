const fs = require("node:fs");
const data = fs.readFileSync("14.txt", "utf8");
const [width, height] = [101, 103];

// Ngl. This problem was not very enjoyable.
//
// Annyway. I cheated. Thanks Hyperneutrino. 
//
// I had to flip the iteration to make it reverse. Simply because
// there was a random iteration with low entropy so I got  false positive.
// Could have made a better entropy calculator, but this works. So why change it.

const guards = data.split('\n').filter(line => line.length > 0).map(line => {
  var [x, y] = line.slice(2, line.indexOf(' ')).split(',').map(Number);
  const [vx, vy] = line.slice(line.indexOf('v') + 2, line.length).split(',').map(Number);
  return [x, y, vx, vy];
});

function mod(a, b) {
  return ((a % b) + b) % b;
}

function draw_map(width, height, guards) {
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      const guard_count = guards.filter(guard => guard[0] == x && guard[1] == y).length;
      if (guard_count == 0) {
        process.stdout.write('.');
      } else {
        process.stdout.write(guard_count.toString());
      }
    }
    process.stdout.write('\n');
  }
}

function move_guards(guards, seconds) {
  return guards.map(guard => {
    const [x, y, vx, vy] = guard;
    return [mod(x + seconds * vx, width), mod(y + seconds * vy, height), vx, vy];
  });
}

function quadrent_count(guards, width, height) {
  const [mid_x, mid_y] = [width, height].map(n => Math.floor(n / 2));
  var quads = [0, 0, 0, 0];
  guards.forEach(guard => {
    const [x, y, vx, vy] = guard;
    if (x < mid_x && y < mid_y) { quads[0] += 1; }
    if (x > mid_x && y < mid_y) { quads[1] += 1; }
    if (x > mid_x && y > mid_y) { quads[2] += 1; }
    if (x < mid_x && y > mid_y) { quads[3] += 1; }
  });
  return quads[0] * quads[1] * quads[2] * quads[3];
}

var min = 0xFFFFFFFFFFFFFFFF
var arg_min = null;
var to_test = [];
for (var seconds = width * height - 1; seconds >= 0; seconds--) {
    const quad_count = quadrent_count(move_guards(guards, seconds), width, height);
    if (quad_count <= min) {
      to_test.push(seconds);
      min = quad_count;
      arg_min = seconds;
    }
}

for (var test in to_test) {
  draw_map(width, height, move_guards(guards, to_test[test]));
  console.log(to_test[test], "\n");
}

console.log(arg_min);
