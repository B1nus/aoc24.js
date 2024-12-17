const fs = require("node:fs");
const data = fs.readFileSync("17.txt", "utf8");

function Computer(A, program) {
  this.A = BigInt(A);
  this.B = BigInt(0);
  this.C = BigInt(0);
  this.PC = BigInt(0);
  this.program = program.map(BigInt);
  this.output = [];
}

Computer.prototype.run_program = function(A) {
  this.A = BigInt(A);
  this.B = BigInt(0);
  this.C = BigInt(0);
  this.PC = BigInt(0);
  this.output = [];
  while (this.PC < this.program.length) {
    const instruction = this.program[this.PC];
    const operand = this.program[this.PC + 1n];
    this.PC += 2n;
    this.perform_instruction(instruction, operand);
  }
}

Computer.prototype.perform_instruction = function(opcode, operand) {
  switch (opcode) {
    case 0n:
      this.adv(operand);
      break;
    case 1n:
      this.bxl(operand);
      break;
    case 2n:
      this.bst(operand);
      break;
    case 3n:
      this.jnz(operand);
      break;
    case 4n:
      this.bxc();
      break;
    case 5n:
      this.out(operand);
      break;
    case 6n:
      this.bdv(operand);
      break;
    case 7n:
      this.cdv(operand);
      break;
    default:
      console.log("Unknown opcode:", opcode);
  }
}

Computer.prototype.combo = function(operand) {
  if (operand < 4n) {
    return operand;
  } else {
    switch (operand) {
      case 4n:
        return this.A;
      case 5n:
        return this.B;
      case 6n:
        return this.C;
      default:
        console.log("Invalid combo operand:", operand);
    }
  }
}

Computer.prototype.adv = function(operand) {
  this.A = this.A >> this.combo(operand);
}

Computer.prototype.bxl = function(operand) {
  this.B = this.B ^ operand;
}

Computer.prototype.bst = function(operand) {
  this.B = this.combo(operand) % 8n;
}

Computer.prototype.jnz = function(operand) {
  if (this.A != 0n) {
    this.PC = operand;
  }
}

Computer.prototype.bxc = function(operand) {
  this.B = this.B ^ this.C;
}

Computer.prototype.out = function(operand) {
  const new_out = this.combo(operand) % 8n;
  this.output.push(new_out);
}

Computer.prototype.bdv = function(operand) {
  this.B = this.A >> this.combo(operand);
}

Computer.prototype.cdv = function(operand) {
  this.C = this.A >> this.combo(operand);
}

Computer.prototype.possible_A = function(out_1) {
  var possible = [];
  for (let A = 8; A < Math.pow(2, 9) - 1; A++) {
    computer.run_program(A);
    if (computer.output[0] == out_1) {
      possible.push(BigInt(A));
    }
  }
  return possible;
}

function match(first_digit_A, second_digit_A, offset) {
  return ((first_digit_A >> (3n * offset)) ^ second_digit_A) % (2n ** 6n) == 0n;
}

function combine(first_digit_A, second_digit_A, offset) {
  return (first_digit_A) | (second_digit_A << (3n * offset));
}

function find_matches(first_digit_As, second_digit_As, offset) {
  var matches = [];
  first_digit_As.forEach(first_digit_A => {
    second_digit_As.forEach(second_digit_A => {
      if (match(first_digit_A, second_digit_A, offset)) {
        matches.push(combine(first_digit_A, second_digit_A, offset));
      }
    });
  })
  return matches;
}


const program = data.split('Program: ')[1].split(',').map(Number);
const computer = new Computer(0, program);
var digits = undefined;
if (process.argv.length > 2) {
  if (process.argv[2] == "find") {
    if (process.argv.length == 3) {
      console.log("Please input a number of digits to find");
      process.exit(0);
    } else {
      digits = Number(process.argv[3]);
    }
  } else {
    computer.run_program(Number(process.argv[2]));
    console.log(computer.output);
    process.exit(0);
  }
}
console.log(digits);
var matches = computer.possible_A(program[0]);
for (let digit = 1; digit < digits; digit++) {
  const next_matches = computer.possible_A(program[digit]);
  matches = find_matches(matches, next_matches, BigInt(digit));
};

matches.sort((a, b) => { if (a > b) { return 1; } else if (a < b) { return -1; } else { return 0 } });
console.log(matches.filter(b => {computer.run_program(b); return computer.output.length == 16 && computer.output[15] == 0}));
