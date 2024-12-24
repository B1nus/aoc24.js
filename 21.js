const fs = require("node:fs");
const data = fs.readFileSync("21.txt", "utf8");
const codes = data.split('\n').filter(l => l.length > 0);

const robots = 25;

// The possible paths from the first character of the key to the
// second character of the key on the numpad.
const numpad_paths = {
  // I cheesed this on a bit. I realized that there were 16 options for
  // the 4 below paths to be. And I just tried every combination until and picked
  // the one which gave me a minimum. Didn't really think that would work but
  // here we are.

  'Av': "<vA",
  // 'Av': "v<A",
  '>^': "<^A",
  // '>^': "^<A",
  // '^>': ">vA",
  '^>': "v>A",
  // 'vA': ">^A",
  'vA': "^>A",

  'A>': "vA",
  'A^': "<A",
  'A<': "v<<A",
  'AA': "A",
  '>A': "^A",
  '>v': "<A",
  '><': "<<A",
  '>>': "A",
  '^A': ">A",
  '^v': "vA",
  '^<': "v<A", // DO not change
  '^^': "A",
  'v>': ">A",
  'v^': "^A",
  'v<': "<A",
  'vv': "A",
  '<A': ">>^A",
  '<>': ">>A",
  '<v': ">A",
  '<^': ">^A", // DO not change
  '<<': "A",
};

cache = {};
cache_hits = 0;

var sum = 0;
codes.forEach(code => {
  const key_seqs = keypad_sequences(code);
  var min = Number.MAX_SAFE_INTEGER;
  key_seqs.forEach(seq => {
    const presses = numpad_sequence_length(seq, robots);
    if (presses < min) {
      min = presses;
    }
  });
  sum += min * Number(code.replace(/[^0-9]/, ''));
});

console.log(sum);

function next_numpad_sequence(sequence) {
  var out = [];
  var from = 'A';
  var to = undefined;
  for (let i = 0; i < sequence.length; i++) {
    to = sequence[i];
    out.push(numpad_paths[from.concat(to)]);
    from = to;
  }
  return out.join('');
}

function keypad_sequences(code) {
  const keypad_map = ['7', '8', '9', '4', '5', '6', '1', '2', '3', null, '0', 'A'];
  const [x, y] = [2, 3];
  var sequences = [{ x: x, y: y, seq: "", step: 0 }];
  var final_sequences = [];

  while (sequences.length > 0) {
    const seq = sequences.splice(0, 1)[0];
    if (seq.step == code.length) {
      final_sequences.push(seq.seq);
      continue;
    }
    const [target_x, target_y] = index_to_pos(keypad_map.indexOf(code[seq.step]), 3);
    get_possibilities(keypad_map, seq.x, seq.y, target_x, target_y).forEach(seq_ => {
      sequences.push({ x: target_x, y: target_y, seq: seq.seq.concat(seq_).concat('A'), step: seq.step + 1 });
    });
    sequences.sort((a, b) => a.seq.length - b.seq.length);
  }

  return final_sequences;
}

function numpad_sequence_length(sequence, steps) {
  const cache_key = sequence.concat(',').concat(steps.toString());
  if (cache_key in cache) {
    cache_hits += 1;
    return cache[cache_key];
  } else {
    // Base cases
    if (steps == 1 && sequence.length == 2) {
      return numpad_paths[sequence].length;
    } else if (steps == 1 && sequence.length == 1) {
      return numpad_paths['A'.concat(sequence)].length;
    } else if (steps <= 0) {
      return sequence.length;
    }

    const length = sequence.slice(0, sequence.length - 1).split('A').map(seq => {
      const next = next_numpad_sequence(seq.concat('A'));
      return numpad_sequence_length(next, steps - 1);
    }).reduce((sum, cur) => sum += cur);

    cache[cache_key] = length;
    return length;
  }
}

function get_possibilities(map, x, y, ex, ey) {
  return possible_sequences(x, y, ex, ey).filter(seq => {
    var [x_, y_] = [x, y];
    for (let i = 0; i < seq.length; i++) {
      switch (seq[i]) {
        case '^':
          y_ -= 1;
          break;
        case '<':
          x_ -= 1;
          break;
        case 'v':
          y_ += 1;
          break;
        case '>':
          x_ += 1;
          break;
      }

      if (x_ + y_ * 3 == 9) {
        return false;
      }
    }
    return true;
  });
}

function possible_sequences(x, y, target_x, target_y) {
  return Array.from(new Set([
    repeat_by_dist('^', 'v', y, target_y).concat(repeat_by_dist('<', '>', x, target_x)),
    repeat_by_dist('<', '>', x, target_x).concat(repeat_by_dist('^', 'v', y, target_y)),
  ]));
}

function repeat_by_dist(more_char, less_char, current, target) {
  return more_char.repeat(Math.max(0, current - target)).concat(less_char.repeat(Math.max(0, target - current)));
}

function index_to_pos(index, width) {
  const x = index % width;
  return [x, (index - x) / width];
}
