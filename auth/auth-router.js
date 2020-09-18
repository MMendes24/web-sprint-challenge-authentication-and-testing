const router = require('express').Router();
const Users = require('./authModel')

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post('/register', (req, res) => {
  // implement registration
  const user = req.body
  const isValid = validateUser(user)

  if (isValid) {
    const hash = bcryptjs.hashSync(user.password, 8)
    user.password = hash

    Users.add(user)
      .then(thenRes => {
        const token = makeJwt(thenRes);

        res.status(201).json({ data: thenRes, token });
      })
      .catch(err => {
        res.status(500).json({ error: 'Internal server error' })
      })
  } else {
    res.status(400).json({
      message: "Invalid information, plese verify and try again",
    })
  }
})

router.post('/login', (req, res) => {
  // implement login
  const creds = req.body
  const isValid = validateCredentials(creds)

  if (isValid) {
    Users.getBy({ username: creds.username })
      .then(([user]) => {
        if (user && bcryptjs.compareSync(creds.password, user.password)) {
          const token = makeJwt(user);

          res.status(200).json({
            token
          });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: "Invalid information.",
    });
  }
});

function validateUser(user) {
  return user.username && user.password ? true : false;
}

function validateCredentials(creds) {
  return creds.username && creds.password ? true : false;
}

function makeJwt({ id, username }) {
  const payload = {
    username,
    subject: id
  }
  const config = {
    jwtSecret: "This is your final test"
  }
  const options = {
    expiresIn: "8h"
  }
  return jwt.sign(payload, config.jwtSecret, options)
}

module.exports = router;
