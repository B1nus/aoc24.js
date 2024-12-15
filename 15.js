const fs = require("node:fs");
const data = fs.readFileSync("15.txt", "utf8");
const width = data.indexOf('\n');

const [map_str, moves_str] = data.split('\n\n');
const map = map_str.split('').filter(c => c != '\n').map(c => { if (c == 'O') { return 2 } else if (c == '#') { return 1 } else if (c == '@') { return 3 } else { return 0 } });

function draw_map(map, width) {
  for (let y = 0; y < map.length / width; y++) {
    for (let x = 0; x < width; x++) {
      const val = map[x + y * width];
      if (val == 1) {
        process.stdout.write('#');
      } else if (val == 2) {
        process.stdout.write('O');
      } else if (val == 3) {
        process.stdout.write('@');
      } else {
        process.stdout.write('.');
      }
    }
    process.stdout.write('\n');
  }
}

// Return the change of index in a tilemap in WASD order. 0 => w, 1 => a, ...
function move_to_delta(move, width) {
  if (move == 0) { return - width; }
  else if (move == 1) { return - 1; }
  else if (move == 2) { return width; }
  else if (move == 3) { return 1; }
}

function make_a_move(map, width, move) {
  const robot_pos = map.indexOf(3);
  const delta = move_to_delta(move, width);
  var i = 1
  while (map[robot_pos + i * delta] == 2) {
    i += 1;
  }
  if (map[robot_pos + i * delta] == 0) {
    i -= 1;
    while (map[robot_pos + i * delta] == 2) {
      map[robot_pos + i * delta + delta] = 2;
      i -= 1;
    }
    map[robot_pos + delta] = 3;
    map[robot_pos] = 0;
  }
}

function playground(map, width) {
  console.log('\x1b[2J\x1b[H');
  draw_map(map, width);

  // Enable raw mode and listen for key presses
  process.stdin.setRawMode(true);
  process.stdin.resume();

  // Attach a data event listener
  process.stdin.on('data', (key) => {
    if (key[0] == 27) {
      switch (key[2]) {
        case 65:
          make_a_move(map, width, 0)
          break;
        case 68:
          make_a_move(map, width, 1)
          break;
        case 66:
          make_a_move(map, width, 2)
          break;
        case 67:
          make_a_move(map, width, 3)
          break;
      }
      console.log('\x1b[2J\x1b[H');
      draw_map(map, width);
    }
    if (key[0] == 3) {
      process.exit(0);
    }
  });
}

function gps(index, width) {
  const x = index % width;
  const y = Math.floor(index / width);
  return 100 * y + x;
}

function all_boxes_gps(map, width) {
  var sum = 0;
  map.forEach((c, i) => {
    if (c == 2) {
      sum += gps(i, width);
    }
  });
  return sum;
}

function read_moves(moves) {
  return moves.split('').filter(c => c != '\n').map(c => {
    if (c == '^') { return 0; }
    else if (c == '<') { return 1; }
    else if (c == 'v') { return 2; }
    else if (c == '>') { return 3; }
  });
}

const moves = read_moves(moves_str);
moves.forEach(move => {
  make_a_move(map, width, move);
});
console.log(all_boxes_gps(map, width));

