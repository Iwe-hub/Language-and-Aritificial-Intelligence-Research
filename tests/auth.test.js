import request from "supertest";
import app from "/server.js";
import mongoose from "mongoose";


//test user input
const testUser = {
    userName: "Testuser",
    email: "testuser@example.com",
    password: "TestPassword123",
};

//store token after login
let authToken;
describe("authentication API tests", () => {
    //disconnect from db after test
    afterAll(async () => {
        await mongoose.connection.close()
    });
});

//test user registration
testUser("user should be able to register", async () => {
    const res = await request(app)
        .post("/v1/register")
        .send(testUser);
    
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBe("success")
    expect(res.body.data).toBeInstanceOf(Array)
});

//test user login
test("user should be able to login", async () => {
    const res = await request(app)
        .post("v1/login")
        .send({
            email: testUser.email,
            password: testUser.password
        });
        expect(res.statusCode).toBe(200)
        expect(res.body.status).toBe("success")
        expect(res.body.token).toBeDefined();

        //store token for logout test
        authToken = res.body.token;
});

//test protected route
test("accessing protected route without auth should fail", async () => {
    const res = await request(app)
        .get("/v1/onboarding");
    expect(res.statusCode).toBe(401);
});

test("accessing protected route with auth should succeed", async () => {
    const res = request(app)
        .get("/v1/onboarding")
        .get("authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBe("success")
});