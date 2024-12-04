const fs = require("node:fs");
const data = fs.readFileSync("4.txt", "utf8");

const size = 1 + data.indexOf('\n');

var middles = [];
for (let i = 0; i < size - 1; i++) {
  middles = middles.concat(count_both_ways(data, "MAS", i, size + 1, size - i));
  middles = middles.concat(count_both_ways(data, "MAS", (i + 1) * size, size + 1, size - i - 1));
  middles = middles.concat(count_both_ways(data, "MAS", i, size - 1, i + 1));
  middles = middles.concat(count_both_ways(data, "MAS", (i + 2) * size - 2, size - 1, size - i - 1));
}

const counts = {};
var count = 0;

for (const num of middles) {
  counts[num] = counts[num] ? counts[num] + 1 : 1;
  if (counts[num] == 2) {
    count += 1;
  }
}

console.log(count);

function count_both_ways(string, substring, start, delta, amount) {
  return count_substrings(string,substring,start,delta,amount).concat(count_substrings(string,substring.split('').reverse().join(''),start,delta,amount));
}

function count_substrings(string, substring, start, delta, amount) {
  current_streak = 0;
  var middle = 0;
  var middles = [];
  for (let i = 0; i < amount; i++) {
    if (string[start + i * delta] == substring[current_streak]) {
      current_streak += 1;
      if (string[start + i * delta] == 'A') {
        middle = start + i * delta;
      }
      if (current_streak == substring.length) {
        middles.push(middle);
        current_streak = 0;
      }
    } else if (string[start + i * delta] == substring[0]) {
      current_streak = 1;
    } else {
      current_streak = 0;
    }
  }
  return middles;
}
