import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
};

const comparePasswords = async (password, hashedPassword) => {
  return bcryptjs.compare(password, hashedPassword);
};

export { generateToken, hashPassword, comparePasswords };
