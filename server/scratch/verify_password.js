const bcrypt = require('bcryptjs');

async function verifyPassword() {
  const hash = '$2b$10$pEhEEv3NJUxTlT5KmtozDuoEi7CUZ2TBGhQrZtSBfyPyVMoV4fcT2';
  const password = '123456789';
  const match = await bcrypt.compare(password, hash);
  console.log('Password match:', match);
}

verifyPassword();
