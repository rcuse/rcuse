import chalk from 'chalk';
import ora from 'ora';

const spinner = ora({ hideCursor: false }).start();

export async function nextTask(label: string, action: () => Promise<any>) {
  spinner.text = label;
  spinner.start();

  try {
    await action();
    spinner.stop();
    console.log(`${chalk.green('✔')} ${label}`);
  } catch (err) {
    spinner.stop();
    console.error(`${chalk.red('✘')} ${err}`);
    if (err.stdout) console.error(chalk.red(err.stdout));
    if (err.stderr) console.error(chalk.red(err.stderr));
    process.exit(1);
  }
}
