const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const app = require('../app');
const { User } = require('../models/user');
const { users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);

describe('GET /api/users', () => {
  it('should get all users', done => {
    request(app)
      .get('/api/users')
      .expect(200)
      .expect(res => {
        expect(res.body.users.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /api/user/:id', function () {
  it('should return a single user', done => {
    request(app)
      .get(`/api/user/${users[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.user._id).toBe(users[0]._id.toHexString());
      })
      .end(done);
  });

  it('should return 404 if user not found', done => {
    request(app)
      .get(`/api/user/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });
  it('should return 404 for invalid ID', done => {
    request(app).get('/api/user/1234567').expect(404).end(done);
  });
});

describe('PATCH /api/user/:id', () => {
  it('should update user info', done => {
    let _id = users[0]._id.toHexString();

    request(app)
      .patch(`/api/user/${_id}`)
      .send({
        firstname: 'changer',
      })
      .expect(200)
      .expect(res => {
        expect(res.body.user.firstname).toBe('changer');
      })
      .end((err, res) => {
        User.findOne({ _id })
          .then(user => {
            expect(user.firstname).toBe('changer');
            done();
          })
          .catch(err => done(err));
      });
  });
});

describe('POST /api/user', () => {
  it('should create a valid user', done => {
    var email = 'example@example.com',
      firstname = 'boy',
      lastname = 'girl',
      mobile = '11111111111';
    var body = { email, firstname, lastname, mobile };
    request(app)
      .post('/api/user')
      .send(body)
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchObject(body);
        expect(res.body._id).toBeTruthy();
      })
      .end(done);
  });
  it('should not create a user for invalid user details', done => {
    request(app)
      .post('/api/user')
      .send({ email: 'hello baby' })
      .expect(400)
      .expect(res => {
        expect(res.statusCode).toBe(400);
      })
      .end(done);
  });
  it('should not create a user if email already exists', done => {
    var email = users[1].email,
      firstname = 'test',
      lastname = 'testing',
      mobile = '11111111211';
    var body = { email, firstname, lastname, mobile };
    request(app).post('/api/user').send(body).expect(400).end(done);
  });
});

describe('DELETE /api/users/:id', () => {
  it('should remove user', done => {
    var user = users[0];
    var id = user._id.toHexString();
    request(app)
      .delete(`/api/user/${id}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.find({ _id: user._id })
          .then(users => {
            expect(users).toHaveLength(0);
            done();
          })
          .catch(e => done(e));
      });
  });
});
