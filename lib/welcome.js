import chalk from 'chalk';
import boxen from 'boxen';

export const welcome = () => {
  const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: 'double',
    borderColor: '#cfa966',
    backgroundColor: '#99b5bf',
  };
  const welcomeMessage = boxen(
    chalk.hex('#333333').bold("Welcome to Peter's Sheet Music Builder"),
    boxenOptions
  );
  console.log(welcomeMessage);
};
