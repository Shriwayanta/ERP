require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Delete existing admin user
  await User.deleteOne({ username: 'admin' });
  
  // Create new admin user
  const user = await User.create({
    username: 'admin',
    email: 'admin@erp.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'Super Admin'
  });
  
  console.log('✅ User created:', user);
  
  // Test password comparison
  const isMatch = await user.comparePassword('admin123');
  console.log('✅ Password test:', isMatch ? 'PASS' : 'FAIL');
  
  process.exit(0);
})
.catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
