const { Console } = require("node:console");
const fs = require("node:fs");
const [initial_str, gates_str] = fs.readFileSync("24.txt", "utf8").trim().split('\n\n');
const initial = new Map(initial_str.split('\n').map(l => l.split(': ')).map(split => [split[0], BigInt(split[1])]));
const gates = new Map(gates_str.split('\n').map(l => l.split(' -> ')).map(split => [split[1], split[0].split(' ')]));
const max_z = Array.from(gates.keys()).filter(key => key[0] == 'z').map(key => Number(key.slice(1))).reduce((max, cur) => cur > max ? cur : max);

function evaluate_wire(wire, initial, gates) {
  if (initial.has(wire)) {
    return initial.get(wire);
  } else {
    const [lhs, op, rhs] = gates.get(wire);
    switch (op) {
      case 'XOR':
        return evaluate_wire(lhs, initial, gates) ^ evaluate_wire(rhs, initial, gates);
      case 'OR':
        return evaluate_wire(lhs, initial, gates) | evaluate_wire(rhs, initial, gates);
      case 'AND':
        return evaluate_wire(lhs, initial, gates) & evaluate_wire(rhs, initial, gates);
      default:
        console.log("ERR");
    }
  }
}

function evaluate_z(initial, gates) {
  var number = 0n;
  for (let i = max_z; i >= 0; i--) {
    number = number << 1n;
    number += evaluate_wire('z'.concat(i.toString().padStart(2, '0')), initial, gates);
  }
  return number;
}

function evaluate_x_and_y(initial) {
  var x = 0n;
  var y = 0n;
  for (let i = max_z - 1; i >= 0; i--) {
    x = x << 1n;
    y = y << 1n;
    x += initial.get('x'.concat(i.toString().padStart(2, '0')));
    y += initial.get('y'.concat(i.toString().padStart(2, '0')));
  }

  return [x, y];
}

function incorrect_zs(x, y, z) {
  var diff = z - x - y;
  var zs = [];
  for (let i = 0; i <= max_z; i++) {
    if ((diff & 1n) == 1n) {
      zs.push('z'.concat(i.toString().padStart(2, '0')));
    }
    diff = diff >> 1n;
  }
  return zs;
}

function print_gates(keys) {
  var count = 0;
  keys.forEach(key => {
    if (gates.has(key)) {
      process.stdout.write("\x1b[33m\t".concat(key.concat('\x1b[0m => ')));
      if ('xy'.includes(gates.get(key)[0][0])) {
        process.stdout.write("\x1b[31m");
      } else {
        process.stdout.write("\x1b[2m");
      }
      process.stdout.write(gates.get(key)[0] + " \x1b[0m" + gates.get(key)[1]);
      if ('xy'.includes(gates.get(key)[2][0])) {
        process.stdout.write(" \x1b[31m");
      } else {
        process.stdout.write(" \x1b[2m");
      }
      process.stdout.write(gates.get(key)[2]);
      process.stdout.write("\x1b[0m");
      count += 1;
      if (count == 6) {
        count = 0;
        process.stdout.write('\n');
      }
    }
  });
  if (count != 0) {
    process.stdout.write('\n');
  }
}

const s = performance.now();
const [x, y] = evaluate_x_and_y(initial);
const z = evaluate_z(initial, gates);
const zs = Array.from({ length: max_z + 1 }, (_, i) => i).map(i => 'z'.concat(i.toString().padStart(2, '0')));
// All z's depend on a xor
var keys = zs.slice();
var depth = 0;
while (keys.length > 0 && depth < Number(process.argv[2])) {
  console.log("Depth", depth);
  print_gates(keys);
  keys = keys.filter(key => gates.has(key)).flatMap(key => [gates.get(key)[0], gates.get(key)[2]]);
  depth += 1;
}
const e = performance.now();
console.log(e - s, "ms");
