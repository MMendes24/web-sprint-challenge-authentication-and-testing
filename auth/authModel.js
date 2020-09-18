const db = require('../database/dbConfig')

module.exports = {
    get,
    add,
    getBy,
}

function get() {
    return db('users')
}

function add(user) {
    return db('users')
        .insert(user)
}

function getBy(filter) {
    return db('users')
        .where(filter)
        .orderBy('id');
}