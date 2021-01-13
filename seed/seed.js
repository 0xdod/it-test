var seeder = require('mongoose-seed');

const DBNAME = 'njsadev';
const url = process.env.MONGO_URI || `mongodb://localhost:27017/${DBNAME}`;

// Connect to MongoDB via Mongoose
seeder.connect(url, function () {
  // Load Mongoose models
  seeder.loadModels(['models/user.js']);

  // Clear specified collections
  seeder.clearModels(['User'], function () {
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function () {
      seeder.disconnect();
    });
  });
});

// Data array containing seed data - documents organized by Model
var data = [
  {
    model: 'User',
    documents: [
      {
        // _id: userOneId,
        email: 'andrew@example.com',
        password: 'userOnePass',
        firstname: 'andrew',
        lastname: 'wilson',
        mobile: '08012345678',
      },
      {
        // _id: userTwoId,
        email: 'jen@example.com',
        password: 'userTwoPass',
        firstname: 'jen',
        lastname: 'rose',
        mobile: '08087654321',
      },
    ],
  },
];
