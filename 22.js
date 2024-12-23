const fs = require("node:fs");
const secret_numbers = fs.readFileSync("22.txt", "utf8").split('\n').filter(l => l.length > 0).map(Number);

function next_secret_number(secret_number) {
  secret_number = (secret_number ^ (secret_number << 6n)) & 0xFFFFFFn;
  secret_number = (secret_number ^ (secret_number >> 5n)) & 0xFFFFFFn;
  secret_number = (secret_number ^ (secret_number << 11n)) & 0xFFFFFFn;
  return secret_number;
}

function sequence_map(secret_number) {
  var num1 = BigInt(secret_number);
  var num2 = next_secret_number(num1);
  var num3 = next_secret_number(num2);
  var num4 = next_secret_number(num3);
  var num5 = next_secret_number(num4);

  var seq_map = new Map;
  for (let i = 0; i < 2000 - 4; i++) {
    const d1 = num2 % 10n - num1 % 10n;
    const d2 = num3 % 10n - num2 % 10n;
    const d3 = num4 % 10n - num3 % 10n;
    const d4 = num5 % 10n - num4 % 10n;
    const key = [d1,d2,d3,d4].toString();
    if (!(key in seq_map)) {
      seq_map[key] = num5 % 10n;
    }
    num1 = num2;
    num2 = num3;
    num3 = num4;
    num4 = num5;
    num5 = next_secret_number(num5);
  }
  return seq_map;
}

// Takes a number between 0-15 and outputs a number between 0-15
// function next_digit(current_digit) {
//   return (current_digit ^ (current_digit << 1)) & 0xFF;
// }
//
// function price_after_sequence(secret_number, d1,d2,d3,d4) {
//   var memory = [];
//   var price = 0;
//   var i = 2000;
//   while (i > 0 && (memory.length < 4 || memory[0] != d1 || memory[1] != d2 || memory[2] != d3 || memory[3] != d4)) {
//     const prev_digit = secret_number.toString().slice(-1);
//     secret_number = next_secret_number(secret_number);
//     const next_digit = secret_number.toString().slice(-1);
//     price = Number(next_digit);
//     memory.push(next_digit - prev_digit);
//
//     if (memory.length == 5) {
//       memory.splice(0,1);
//     }
//
//     i -= 1;
//   }
//   if (i == 0) {
//     return 0;
//   }
//   return price;
// }

// const start_time = performance.now();

// const sum = secret_numbers.map(n => {
//   var num = n;
//   for (let i = 0; i < 2000; i++) {
//     num = next_secret_number(num);
//   }
//   // console.log(num);
//   return num;
// }).reduce((sum, cur) => sum += cur);

// var max = 0;
// for (let d1 = -3; d1 <= 3; d1++) {
//   for (let d2 = -3; d2 <= 3; d2++) {
//     for (let d3 = -3; d3 <= 3; d3++) {
//       for (let d4 = -3; d4 <= 3; d4++) {
//         const bananas = secret_numbers.map(num => {
//           return price_after_sequence(num, d1,d2,d3,d4);
//         }).reduce((sum, cur) => sum += cur);
//
//         if (bananas > max) {
//           max = bananas;
//           console.log("NEW MAX: ", bananas);
//         }
//
//         console.log(d1,d2,d3,d4, "MAX:", max);
//       }
//     }
//   }
// }
// const end_time = performance.now();
// console.log(/* sum,  */end_time - start_time, "ms");

var num1 = BigInt(process.argv[2]);
var num2 = next_secret_number(num1);
var num3 = next_secret_number(num2);
var num4 = next_secret_number(num3);
var num5 = next_secret_number(num4);
for (let i = 0; i < Number(process.argv[3]) - 4; i++) {
  console.log(num1, " \t", num2 % 10n - num1 % 10n, num2, "\t", num3 % 10n - num2 % 10n, num3, "\t", num4 % 10n - num3 % 10n, num4, "\t", num5 % 10n - num4 % 10n, num5);
  num1 = num2;
  num2 = num3;
  num3 = num4;
  num4 = num5;
  num5 = next_secret_number(num5);
}

var sequences = new Set;
var maps = [];
secret_numbers.forEach(secret_number => {
  const seq_map = sequence_map(secret_number);
  maps.push(seq_map);
  for (let sequence in seq_map) {
    sequences.add(sequence);
  }
});

var max = 0n;
sequences.forEach(sequence => {
  var sum = 0n;
  maps.forEach(seq_map => {
    if (sequence in seq_map) {
      sum += seq_map[sequence];
    }
  });
  if (sum > max) {
    max = sum;
  }
});

console.log(max);
