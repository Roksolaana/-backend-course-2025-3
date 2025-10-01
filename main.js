#!/usr/bin/env node

const fs = require('fs');
const { Command } = require('commander');
const program = new Command();

program
  .requiredOption('-i, --input <path>', 'input file path')
  .option('-o, --output <path>', 'output file path')
  .option('-d, --display', 'display output in console')
  .option('-D, --date', 'show flight date')
  .option('-a, --airtime <number>', 'filter by minimum AIR_TIME', parseFloat);

program.parse(process.argv);

const options = program.opts();

// Перевірка обовʼязкового параметру input
if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

// Читання файлу
let rawData;
try {
  rawData = fs.readFileSync(options.input, 'utf-8');
} catch (err) {
  console.error('Cannot find input file');
  process.exit(1);
}

// Парсинг JSON: кожен рядок - окремий обʼєкт
const lines = rawData.split('\n').filter(line => line.trim() !== '');
let data;
try {
  data = lines.map(line => JSON.parse(line));
} catch (err) {
  console.error('Error reading or parsing input file:', err.message);
  process.exit(1);
}

// Фільтрація за airtime, якщо задано
let filteredData = data;
if (options.airtime) {
  filteredData = data.filter(item => item.AIR_TIME > options.airtime);
}

// Формування виводу
const outputLines = filteredData.map(item => {
  let line = '';
  if (options.date) line += `${item.FL_DATE} `;
  line += `${item.AIR_TIME} ${item.DISTANCE}`;
  return line;
});

const outputText = outputLines.join('\n');

// Вивід у консоль
if (options.display) console.log(outputText);

// Запис у файл
if (options.output) {
  try {
    fs.writeFileSync(options.output, outputText, 'utf-8');
  } catch (err) {
    console.error('Error writing to output file:', err.message);
  }
}

// Якщо не задано ні -d, ні -o, нічого не виводимо
