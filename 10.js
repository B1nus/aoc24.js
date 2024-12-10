const fs = require("node:fs");
const data = fs.readFileSync("10.txt", "utf8");
const width = data.indexOf('\n') + 1;

var index = data.indexOf('0');
var trailheads = [];
while (index != -1) {
  trailheads.push(index);
  index = data.indexOf('0', index + 1);
}

function get_queue(pos, width, len) {
  var queue = [];
  if (pos > width) { queue.push(pos - width); }
  if (pos < len - width) { queue.push(pos + width); }
  if (pos % width != 0) { queue.push(pos - 1); }
  if (pos % width != width - 2) { queue.push(pos + 1); }
  return queue
}

console.log(trailheads);
var count = 0;
trailheads.forEach(start => {
  var queue = [start];
  var number = 0;
  var nines = new Set;
  while (queue.length > 0) {
    var new_new_queue = [];
    for (let i = 0; i < queue.length; i++) {
      var new_queue = get_queue(queue[i], width, data.length);
      for (let j = 0; j < new_queue.length; j++) {
        if (data[new_queue[j]] == number + 1) {
          if (number + 1 == 9) {
            nines.add(new_queue[j]);
          }
          new_new_queue.push(new_queue[j]);
        }
      }
    }
    number += 1;
    if (number == 9) {
      console.log(nines.size);
      count += nines.size
      break;
    }
    queue = new_new_queue;
    console.log(queue);
  }
});

console.log(count);
