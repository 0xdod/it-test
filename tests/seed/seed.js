const ObjectID = require('mongoose').Types.ObjectId;

const { User } = require('../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
  {
    _id: userOneId,
    email: 'andrew@example.com',
    firstname: 'andrew',
    lastname: 'wilson',
    mobile: '08012345678',
  },
  {
    _id: userTwoId,
    email: 'jen@example.com',
    firstname: 'jen',
    lastname: 'rose',
    mobile: '08087654321',
  },
];

const populateUsers = done => {
  User.deleteMany({})
    .then(() => {
      var userOne = new User(users[0]).save();
      var userTwo = new User(users[1]).save();
      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

module.exports = {
  users,
  populateUsers,
};
