import crypto from 'crypto';
const secret = crypto.randomBytes(64).toString('hex');
console.log('Your JWT Secret:');
console.log(secret);
console.log('\nCopy this to your .env file as JWT_SECRET=' + secret);