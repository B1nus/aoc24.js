const fs = require("node:fs");
const secret_numbers = fs.readFileSync("22.txt", "utf8").split('\n').filter(l => l.length > 0).map(Number);

function next_secret_number(secret_number) {
  secret_number = BigInt(secret_number);
  secret_number = (secret_number << 6n) ^ secret_number;
  secret_number &= 0xFFFFFFn;
  secret_number = secret_number ^ (secret_number >> 5n);
  secret_number &= 0xFFFFFFn;
  secret_number = secret_number ^ (secret_number << 11n);
  return Number(secret_number & 0xFFFFFFn);
}

const sum = secret_numbers.map(n => {
  var num = n;
  for (let i = 0; i < 2000; i++) {
    num = next_secret_number(num);
  }
  // console.log(num);
  return num;
}).reduce((sum, cur) => sum += cur);

console.log(sum);
