const fs = require("node:fs");
const data = fs.readFileSync("4.txt", "utf8");

const size = 1 + data.indexOf('\n');

var count = 0;
for (let i = 0; i < size - 1; i++) {
  count += count_both_ways(data, "XMAS", 0 + i * size, 1, size);
  count += count_both_ways(data, "XMAS", i, size, size);

  count += count_both_ways(data, "XMAS", i, size + 1, size - i);
  count += count_both_ways(data, "XMAS", (i + 1) * size, size + 1, size - i - 1);
  count += count_both_ways(data, "XMAS", i, size - 1, i + 1);
  count += count_both_ways(data, "XMAS", (i + 2) * size - 2, size - 1, size - i - 1);
}

console.log(count);

function count_both_ways(string, substring, start, delta, amount) {
  return count_substrings(string,substring,start,delta,amount) + count_substrings(string,substring.split('').reverse().join(''),start,delta,amount);
}

function count_substrings(string, substring, start, delta, amount) {
  current_streak = 0;
  count = 0;
  for (let i = 0; i < amount; i++) {
    if (string[start + i * delta] == substring[current_streak]) {
      current_streak += 1;
      if (current_streak == substring.length) {
        count += 1;
        current_streak = 0;
      }
    } else if (string[start + i * delta] == substring[0]) {
      current_streak = 1;
    } else {
      current_streak = 0;
    }
  }
  return count;
}
