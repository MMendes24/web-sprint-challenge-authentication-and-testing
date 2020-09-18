const supertest = require('supertest')
const server = require('./server.js');

const db = require('../database/dbConfig');


describe('server', () => {
    //empties the table after all server tests are performed
    afterAll(async () => {
        await db('users').truncate();
    })

    describe('POST /api/auth/register', () => {
        it('should register a new user', () => {
            return supertest(server)
                .post('/api/auth/register')
                .send({
                    username: 'user1',
                    password: 'pass'
                })
                .then(res => {
                    expect(res.status).toBe(201)
                })
        })
        it('should fail when passed bad data', () => {
            return supertest(server)
                .post('/api/auth/register')
                .send({
                    username: ""
                })
                .then(res => {
                    expect(res.status).toBe(400)
                })
        })
        it('should return JSON', () => {
            return supertest(server)
                .post('/api/auth/register')
                .send({
                    username: 'user2',
                    password: 'pass'
                })
                .then(res => {
                    expect(res.type).toMatch(/json/i);
                })
        })
        it('should have a length of two before its nuked', async () => {
            const users = await db('users')

            expect(users).toHaveLength(2)
        })
    })
    describe('/api/auth/login', () => {
        it('should be able to login using created user', () => {
            return supertest(server)
                .post('/api/auth/login')
                .send({
                    username: 'user1',
                    password: 'pass'
                })
                .then(res => {
                    expect(res.status).toBe(200)
                })
        })
        it('should fail if you pass invalid credentials', () => {
            return supertest(server)
                .post('/api/auth/login')
                .send({
                    username: 'user3',
                    password: 'passNo'
                })
                .then(res => {
                    expect(res.status).toBe(401)
                })
        })
        it('should fail if you do not pass all required fields', () => {
            return supertest(server)
                .post('/api/auth/login')
                .send({
                    username: 'user1',
                })
                .then(res => {
                    expect(res.status).toBe(400)
                })
        })
        it('should give me a token for verification purposes', () => {
            return supertest(server)
            .post('/api/auth/login')
            .send({
                username: 'user1',
                password: 'pass'
            })
            .then(res => {
                expect(res.body.token).toBeTruthy()
            })
        })
    })
})