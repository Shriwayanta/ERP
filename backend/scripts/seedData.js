require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const User = require('../models/User');
const Student = require('../models/Student');
const { Book } = require('../models/Library');
const Room = require('../models/Room');

// Connect to database
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ MongoDB Connected for seeding'))
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

// Seed data
const seedUsers = async () => {
  try {
    await User.deleteMany();
    
    const users = [
      {
        username: 'admin',
        email: 'admin@erp.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'Super Admin'
      },
      {
        username: 'john_dept',
        email: 'john@erp.com',
        password: 'pass123',
        name: 'John Doe',
        role: 'Department Head'
      },
      {
        username: 'sarah_faculty',
        email: 'sarah@erp.com',
        password: 'pass123',
        name: 'Sarah Johnson',
        role: 'Faculty'
      },
      {
        username: 'mike_accountant',
        email: 'mike@erp.com',
        password: 'pass123',
        name: 'Mike Wilson',
        role: 'Accountant'
      },
      {
        username: 'lisa_warden',
        email: 'lisa@erp.com',
        password: 'pass123',
        name: 'Lisa Brown',
        role: 'Hostel Warden'
      }
    ];

    await User.insertMany(users);
    console.log('✅ Users seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
};

const seedStudents = async () => {
  try {
    await Student.deleteMany();
    
    const students = [];
    const courses = ['Computer Science', 'Electronics', 'Mechanical', 'Civil'];
    const years = [1, 2, 3, 4];
    
    for (let i = 1; i <= 50; i++) {
      students.push({
        studentId: `STU${String(i).padStart(4, '0')}`,
        personalInfo: {
          name: `Student ${i}`,
          dob: new Date(2000 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
          gender: i % 3 === 0 ? 'Female' : 'Male',
          contact: `98${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
          email: `student${i}@college.edu`,
          address: `Address ${i}, City, State`,
          parentContact: `99${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`
        },
        academicInfo: {
          course: courses[Math.floor(Math.random() * courses.length)],
          year: years[Math.floor(Math.random() * years.length)],
          rollNo: `ROLL${String(i).padStart(4, '0')}`,
          department: courses[Math.floor(Math.random() * courses.length)]
        },
        financialInfo: {
          feeStatus: ['Paid', 'Pending', 'Partial'][Math.floor(Math.random() * 3)],
          totalFees: 50000,
          paidAmount: Math.floor(Math.random() * 50000),
          dues: 0
        },
        hostelInfo: {
          isHostelResident: i % 2 === 0,
          roomNo: i % 2 === 0 ? `R${String(Math.floor(i/2)).padStart(3, '0')}` : null,
          blockName: i % 2 === 0 ? ['Block A', 'Block B', 'Block C'][Math.floor(Math.random() * 3)] : null
        }
      });
    }

    // Calculate dues
    students.forEach(student => {
      student.financialInfo.dues = student.financialInfo.totalFees - student.financialInfo.paidAmount;
    });

    await Student.insertMany(students);
    console.log('✅ Students seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding students:', error);
  }
};

const seedRooms = async () => {
  try {
    await Room.deleteMany();
    
    const rooms = [];
    const blocks = ['Block A', 'Block B', 'Block C'];
    const floors = [1, 2, 3, 4];
    const types = ['Single', 'Double', 'Triple'];
    
    let roomCounter = 1;
    
    for (const block of blocks) {
      for (const floor of floors) {
        for (let i = 1; i <= 10; i++) {
          const type = types[Math.floor(Math.random() * types.length)];
          const capacity = type === 'Single' ? 1 : type === 'Double' ? 2 : 3;
          
          rooms.push({
            roomNumber: `${block.split(' ')[1]}${floor}${String(i).padStart(2, '0')}`,
            blockName: block,
            floor: floor,
            capacity: capacity,
            currentOccupancy: Math.floor(Math.random() * (capacity + 1)),
            type: type,
            facilities: ['Bed', 'Study Table', 'Wardrobe', 'Fan'],
            status: Math.random() > 0.2 ? 'Occupied' : 'Available',
            rent: type === 'Single' ? 8000 : type === 'Double' ? 6000 : 5000
          });
          roomCounter++;
        }
      }
    }

    await Room.insertMany(rooms);
    console.log('✅ Rooms seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding rooms:', error);
  }
};

const seedBooks = async () => {
  try {
    await Book.deleteMany();
    
    const categories = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Literature', 'Engineering'];
    const books = [];
    
    for (let i = 1; i <= 100; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const totalCopies = Math.floor(Math.random() * 5) + 1;
      const issuedCopies = Math.floor(Math.random() * totalCopies);
      
      books.push({
        isbn: `ISBN-${String(Math.floor(Math.random() * 10000000000)).padStart(10, '0')}`,
        title: `Book Title ${i}`,
        author: `Author ${Math.floor(Math.random() * 50) + 1}`,
        publisher: `Publisher ${Math.floor(Math.random() * 10) + 1}`,
        category: category,
        publicationYear: 2010 + Math.floor(Math.random() * 14),
        edition: `${Math.floor(Math.random() * 5) + 1}st`,
        totalCopies: totalCopies,
        availableCopies: totalCopies - issuedCopies,
        location: {
          shelf: `S${Math.floor(Math.random() * 20) + 1}`,
          section: category
        },
        price: Math.floor(Math.random() * 2000) + 200,
        status: issuedCopies === totalCopies ? 'Issued' : 'Available'
      });
    }

    await Book.insertMany(books);
    console.log('✅ Books seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding books:', error);
  }
};

// Run all seed functions
const seedAll = async () => {
  console.log('🌱 Starting database seeding...\n');
  
  await seedUsers();
  await seedStudents();
  await seedRooms();
  await seedBooks();
  
  console.log('\n✨ Database seeding completed successfully!');
  console.log('\n📝 Default Login Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Username: admin');
  console.log('Password: admin123');
  console.log('Role: Super Admin');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\nOther Test Users:');
  console.log('• john_dept / pass123 (Department Head)');
  console.log('• sarah_faculty / pass123 (Faculty)');
  console.log('• mike_accountant / pass123 (Accountant)');
  console.log('• lisa_warden / pass123 (Hostel Warden)');
  console.log('\n🚀 Start your server with: npm run dev');
  
  mongoose.connection.close();
  process.exit(0);
};

// Execute seeding
seedAll().catch(error => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});