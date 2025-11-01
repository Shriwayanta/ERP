require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Test 1: Direct bcrypt test
  console.log('\n=== Test 1: Direct bcrypt ===');
  const plainPassword = 'admin123';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);
  console.log('Plain:', plainPassword);
  console.log('Hashed:', hashedPassword);
  
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  console.log('Direct comparison result:', isMatch);
  
  // Test 2: Check database user
  console.log('\n=== Test 2: Check database ===');
  const User = require('./models/User');
  
  const user = await User.findOne({ username: 'admin' });
  if (user) {
    console.log('User found:', user.username);
    console.log('Stored password hash:', user.password);
    console.log('Password length:', user.password.length);
    
    // Test comparison
    const match = await bcrypt.compare('admin123', user.password);
    console.log('Comparison with admin123:', match);
  } else {
    console.log('User NOT found in database');
  }
  
  // Test 3: Create fresh user manually
  console.log('\n=== Test 3: Create manual user ===');
  await User.deleteOne({ username: 'testuser' });
  
  const testUser = new User({
    username: 'testuser',
    email: 'test@test.com',
    password: 'admin123',
    name: 'Test User',
    role: 'Super Admin'
  });
  
  await testUser.save();
  console.log('Test user created');
  
  // Find and test
  const foundUser = await User.findOne({ username: 'testuser' });
  const testMatch = await foundUser.comparePassword('admin123');
  console.log('Test user password match:', testMatch);
  
  process.exit(0);
})
.catch(err => {
  console.error('Error:', err);
  process.exit(1);
});