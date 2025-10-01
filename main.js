const fs = require('fs');
const { Command } = require('commander');
const program = new Command();

program
  .name('flights-app')
  .description('Програма для роботи з даними про польоти')
  .version('1.0.0');

program
  .option('-f, --file <path>', 'шлях до файлу JSON', 'flights-1m.json')
  .option('-n, --num <number>', 'кількість записів для обробки', parseInt);

program.parse(process.argv);
const options = program.opts();

if (!fs.existsSync(options.file)) {
  console.error(`Файл ${options.file} не знайдено`);
  process.exit(1);
}

const data = fs.readFileSync(options.file, 'utf-8');
const flights = JSON.parse(data);

console.log(`Файл ${options.file} завантажено, загальна кількість записів: ${flights.length}`);

if (options.num) {
  console.log(`Виведено перші ${options.num} записів:`);
  console.log(flights.slice(0, options.num));
} else {
  console.log('Виведено перші 5 записів:');
  console.log(flights.slice(0, 5));
}
