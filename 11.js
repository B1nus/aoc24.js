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

memoization = {};

// Dynamic Programming for the win!
function stones_in(stones, blinks) {
  var count = 0;
  if (blinks > 0) {
    const key = stones.join(' ');
    if (key in memoization) {
      stones = memoization.key.split(' ');
    } else {
      stones = blink(stones);
      memoization.key = stones.join(' ');
      blinks -= 1;
      stones.forEach(stone => {
        count += stones_in([stone], blinks);
      });
      return count;
    }
  } else {
    return stones.length;
  }
}

console.log(stones_in(stones, Number(process.argv[2])));

