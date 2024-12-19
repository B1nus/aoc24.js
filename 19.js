const fs = require("node:fs");
const data = fs.readFileSync("19.txt", "utf8");
const [towels_str, designs_str] = data.split('\n\n');
const towels = towels_str.split(', ');
const designs = designs_str.split('\n').filter(l => l.length > 0);

memoization = {};

function count_possible_configs(design, towels) {
  if (design in memoization) {
    return memoization[design];
  } else {
    var count = 0;

    for (let i = 0; i < towels.length; i++) {
      const towel = towels[i];
      const tow_len = towel.length;
      if (design.length >= towel.length && design.slice(0, tow_len).valueOf() == towel) {
        if (design.length == towel.length) {
          count += 1;
        } else {
          count += count_possible_configs(design.slice(tow_len, design.length), towels);
        }
      }
    }
    memoization[design] = count;
    return count;
  }
}

var count = 0;
designs.forEach(design => {
  count += count_possible_configs(design, towels);
});
console.log(count);

