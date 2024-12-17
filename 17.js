const fs = require("node:fs");
const data = fs.readFileSync("17.txt", "utf8");

function Computer(data) {
  const [registers_str, program_str] = data.split('\n\n');
  const registers = registers_str.split('\n').map(r => { return Number(r.split(': ')[1]) });
  this.A = registers[0];
  this.B = registers[1];
  this.C = registers[2];
  this.PC = 0;
  this.program = program_str.split(': ')[1].trim().split(',').filter(c => c != '\n').map(Number);
}

Computer.prototype.run_program = function() {
  while (this.PC < this.program.length) {
    const instruction = this.program[this.PC];
    const operand = this.program[this.PC + 1];
    this.PC += 2;
    this.perform_instruction(instruction, operand);
  }
  process.stdout.write('\n');
}

Computer.prototype.perform_instruction = function(opcode, operand) {
  switch (opcode) {
    case 0:
      this.adv(operand);
      break;
    case 1:
      this.bxl(operand);
      break;
    case 2:
      this.bst(operand);
      break;
    case 3:
      this.jnz(operand);
      break;
    case 4:
      this.bxc();
      break;
    case 5:
      this.out(operand);
      break;
    case 6:
      this.bdv(operand);
      break;
    case 7:
      this.cdv(operand);
      break;
    default:
      console.log("Unknown opcode:", opcode);
  }
}

Computer.prototype.combo = function (operand) {
  if (operand < 4) {
    return operand;
  } else {
    switch (operand) {
      case 4:
        return this.A;
      case 5:
        return this.B;
      case 6:
        return this.C;
      default:
        console.log("Invalid combo operand:", operand);
    }
  }
}

Computer.prototype.adv = function (operand) {
  this.A = Math.floor(this.A / Math.pow(2, this.combo(operand)));
}

Computer.prototype.bxl = function (operand) {
  this.B = this.B ^ operand;
}

Computer.prototype.bst = function (operand) {
  this.B = this.combo(operand) % 8;
}

Computer.prototype.jnz = function (operand) {
  if (this.A != 0) {
    this.PC = operand;
  }
}

Computer.prototype.bxc = function (operand) {
  this.B = this.B ^ this.C;
}

Computer.prototype.out = function (operand) {
  process.stdout.write((this.combo(operand) % 8).toString());
  process.stdout.write(',');
}

Computer.prototype.bdv = function (operand) {
  this.B = Math.floor(this.A / Math.pow(2, this.combo(operand)));
}

Computer.prototype.cdv = function (operand) {
  this.C = Math.floor(this.A / Math.pow(2, this.combo(operand)));
}

const computer = new Computer(data);
computer.run_program();
