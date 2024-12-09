const fs = require("node:fs");
const data = fs.readFileSync("9.txt", "utf8").trim();

var checksum = 0;

if (data.length % 2 != 1) { console.log("not odd??!! oh no...") };
var end_i = data.length - 1; // I assume an odd number of arguments
var end_count = Number(data[end_i]);
var index = 0;
var out = "";
for (let i = 0; i < data.length && i < end_i; i++) {
  const times = Number(data[i]);
  const ari_sum = times / 2 * (index + index + times - 1);
  if (i % 2 == 0) {
    checksum += ari_sum * Math.floor(i / 2);
    index += times;
    for (let j = 0; j < times; j++) {
      out = out.concat(Math.floor(i / 2));
    }
  } else {
    var left_to_add = times;
    while (left_to_add > 0) {
      if (end_count >= left_to_add) {
        checksum += (left_to_add / 2 * (index + index + left_to_add - 1)) * Math.floor(end_i / 2);
        end_count -= left_to_add;
        index += left_to_add;
        for (let j = 0; j < left_to_add; j++) {
          out = out.concat(Math.floor(end_i / 2));
        }
        left_to_add = 0;
      } else {
        left_to_add -= end_count;
        checksum += Math.floor(end_i / 2) * (end_count / 2 * (index + index + end_count - 1));
        for (let j = 0; j < end_count; j++) {
          out = out.concat(Math.floor(end_i / 2));
        }
        index += end_count;
        end_count = 0;
      }
      if (end_count == 0) {
        end_i -= 2;
        end_count = Number(data[end_i]);
        if (end_i < i) {
          end_count = 0;
          break;
        }
      }
    }
  }
}
if (end_count != 0) {
  checksum += (end_count / 2 * (index + index + end_count - 1)) * Math.floor(end_i/2);
}

console.log(checksum);
