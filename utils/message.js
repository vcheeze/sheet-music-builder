import chalk from 'chalk';
import boxen from 'boxen';

export const headerMessage = (message) => {
  const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: 'double',
    borderColor: '#cfa966',
    backgroundColor: '#99b5bf',
  };
  const prettyMessage = boxen(chalk.hex('#333333').bold(message), boxenOptions);
  console.log(prettyMessage);
};

export const sectionMessage = (message) => {
  const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: 'single',
    borderColor: '#cfa966',
    backgroundColor: '#99b5bf',
  };
  const prettyMessage = boxen(chalk.hex('#333333').bold(message), boxenOptions);
  console.log(prettyMessage);
};
