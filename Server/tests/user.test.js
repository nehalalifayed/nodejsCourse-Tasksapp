const request = require('supertest')
const app = require('../../expressApp')
 
test('should register a new user' , async ()=>{

    await request(app).post('/users').send({
        name: "test" , email : "test@test.com" , password: "hi@test123" , age:25
    }).expect(201);
})