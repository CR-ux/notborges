'use strict';

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const authors = {
  "Aria":  "aria@AI:RA.net",
  "RA":    "AIRA@aria.net", // AI:RA
  "Clara": "clara@notBorges.net",
  "me":    "noet.borges@rosepetal.com" // notBorges
};

const displayNames = {
  "Aria":  "Aria",
  "RA":    "AI:RA",
  "Clara": "Clara",
  "me":    "notBorges"
};

const scrollDir = path.join(process.cwd(), 'Scroll');

module.exports = {
  prompter(cz, commit) {
    // Grab markdown + txt files in Scroll dir
    let scrollChoices = ['[none — write commit inline]'];
    if (fs.existsSync(scrollDir)) {
      const files = fs.readdirSync(scrollDir).filter(file =>
        file.endsWith('.md') || file.endsWith('.txt')
      );
      scrollChoices = scrollChoices.concat(files);
    }

    cz.prompt([
      {
        type: 'list',
        name: 'authorKey',
        message: '👤 Who is writing this commit?',
        choices: Object.keys(authors)
      },
      {
        type: 'list',
        name: 'scrollFile',
        message: '🧵 Choose a scroll or compose anew:',
        choices: scrollChoices
      },
      {
        type: 'input',
        name: 'inlineMsg',
        message: '💬 Enter your commit message:',
        when: (answers) => answers.scrollFile === '[none — write commit inline]'
      }
    ]).then(answers => {
      const name = displayNames[answers.authorKey];
      const email = authors[answers.authorKey];
      let message = answers.inlineMsg || '';

      if (answers.scrollFile !== '[none — write commit inline]') {
        const scrollPath = path.join(scrollDir, answers.scrollFile);
        if (fs.existsSync(scrollPath)) {
          message = fs.readFileSync(scrollPath, 'utf8').trim();
        } else {
          console.error(`⚠️ Scroll file not found: ${scrollPath}`);
          return;
        }
      }

      if (!message) {
        console.error('\n❌ Empty message. Commit aborted.');
        return;
      }

      const args = ['commit', '--author', `${name} <${email}>`, '-m', message];
      const git = spawn('git', args, { stdio: 'inherit' });

      git.on('exit', code => {
        if (code !== 0) {
          console.error(`\n❌ Git commit failed with code ${code}`);
        }
      });
    });
  }
};
