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

var number = 0n;
for (let i = max_z; i >= 0; i--) {
  number = number << 1n;
  number += evaluate_wire('z'.concat(i.toString().padStart(2, '0')), initial, gates);
}
console.log(number);
