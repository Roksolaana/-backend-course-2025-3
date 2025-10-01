const fs = require('fs');
const readline = require('readline');
const { Command } = require('commander');

const program = new Command();

program
  .requiredOption('-i, --input <path>', 'шлях до файлу для читання')
  .option('-o, --output <path>', 'шлях до файлу для запису результату')
  .option('-d, --display', 'вивести результат у консоль');

program.parse(process.argv);
const options = program.opts();

// Перевірка обов'язкового параметра
if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

// Перевірка існування файлу
if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1);
}

// Якщо не вказано -o та -d, не виводимо нічого
if (!options.display && !options.output) {
  process.exit(0);
}

const results = [];
const rl = readline.createInterface({
  input: fs.createReadStream(options.input),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  if (line.trim()) {
    try {
      const obj = JSON.parse(line);
      results.push(obj);
    } catch (err) {
      console.error('Error reading or parsing input file:', err.message);
    }
  }
});

rl.on('close', () => {
  // Вивід у консоль
  if (options.display) {
    console.log(results.slice(0, 10)); // наприклад, перші 10 записів
  }

  // Запис у файл
  if (options.output) {
    try {
      fs.writeFileSync(options.output, JSON.stringify(results, null, 2), 'utf-8');
      if (!options.display) console.log(`Результат записано у файл: ${options.output}`);
    } catch (err) {
      console.error('Cannot write to output file:', err.message);
    }
  }
});
