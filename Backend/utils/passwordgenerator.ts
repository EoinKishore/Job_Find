import * as secureRandomPassword from 'secure-random-password';
export const generatePassword = () => {
  return secureRandomPassword.randomPassword({
    length: 7,
    characters: [
      secureRandomPassword.lower,
      secureRandomPassword.upper,
      secureRandomPassword.digits,
      secureRandomPassword.symbols,
    ],
  });
};
