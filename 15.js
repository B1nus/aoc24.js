const fs = require("node:fs");
const data = fs.readFileSync("15.txt", "utf8");
const width = 2 * data.indexOf('\n');

const [map_str, moves_str] = data.split('\n\n');
const map = expanded_map(map_str);

function expanded_map(map_str) {
  var map = [];
  map_str.split('').filter(c => c != '\n').forEach(c => {
    if (c == 'O') {
      map.push(2);
      map.push(3);
    } else if (c == '#') {
      map.push(1);
      map.push(1);
    } else if (c == '@') {
      map.push(4);
      map.push(0);
    } else {
      map.push(0);
      map.push(0);
    }
  });
  return map;
}

function draw_map(map, width) {
  for (let y = 0; y < map.length / width; y++) {
    for (let x = 0; x < width; x++) {
      const val = map[x + y * width];
      if (val == 1) {
        process.stdout.write('#');
      } else if (val == 2) {
        process.stdout.write('[');
      } else if (val == 3) {
        process.stdout.write(']');
      } else if (val == 4) {
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
  const robot_pos = map.indexOf(4);
  const delta = move_to_delta(move, width);
  var i = 1;
  var boxes_to_push = [robot_pos];
  var found_new = true;
  var blocked = false;
  while (found_new) {
    var new_boxes = [];
    found_new = false;
    boxes_to_push.forEach(box => {
      if (boxes_to_push.indexOf(box + delta) == -1) {
        if (map[box + delta] == 2) {
          new_boxes.push(box + delta);
          new_boxes.push(box + delta + 1);
        } else if (map[box + delta] == 3) {
          new_boxes.push(box + delta);
          new_boxes.push(box + delta - 1);
        } else if (map[box + delta] == 1) {
          blocked = true;
        }
      }
    });
    if (new_boxes.length > 0) {
      found_new = true;
      new_boxes.forEach(new_box => {
        if (boxes_to_push.indexOf(new_box) == - 1) {
          boxes_to_push.push(new_box);
        }
      });
    }
  }
  if (!blocked) {
    boxes_to_push.reverse().forEach(box => {
      map[box + delta] = map[box];
      map[box] = 0;
    });
    map[robot_pos + delta] = 4;
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
      // console.log('\x1b[2J\x1b[H');
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

