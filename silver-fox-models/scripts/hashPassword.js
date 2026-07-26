// Usage: npm run hash-password -- "YourChosenPassword"
// Prints a bcrypt hash you paste into .env as ADMIN_PASSWORD_HASH

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.log('\nUsage: npm run hash-password -- "YourChosenPassword"\n');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log('\nAdd this line to your .env file:\n');
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
