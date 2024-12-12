const fs = require("node:fs");
const data = fs.readFileSync("11.txt", "utf8");

var stones = data.split(' ').map(str => Number(str).toString());

function blink(stones) {
  new_stones = [];
  stones.forEach(stone => {
    if (stone == '0') {
      new_stones.push('1');
    } else if (stone.length % 2 == 0) {
      new_stones.push(stone.slice(0, stone.length / 2));
      new_stones.push(Number(stone.slice(stone.length / 2, stone.length)).toString());
    } else {
      new_stones.push((Number(stone) * 2024).toString());
    }
  });
  return new_stones;
}

function count_map(array) {
  var map = {};
  array.forEach(item => {
    if (!(item in map)) {
      map[item] = 0;
    }
    map[item] += 1;
  });
  return map;
}

// This algorithm was my dad's idea. Credits go to him.
//
// Hint: notice how much repetition of the same numbers there are after running part 1.
function stone_count(stones, blinks) {
  const times = Math.min(25, blinks);
  for (let i = 0; i < times; i++) {
    stones = blink(stones);
  }
  blinks -= times;
  if (blinks == 0) {
    return stones.length;
  } else {
    var map = count_map(stones);
    var count = 0;
    for (var key in map) {
      count += stone_count([key], blinks) * map[key];
    }
    return count;
  }
}

console.log(stone_count(stones, 75));

