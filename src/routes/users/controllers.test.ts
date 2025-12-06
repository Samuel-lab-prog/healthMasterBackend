import { describe, it, expect, mock } from "bun:test";
import { Elysia } from "elysia";
import { userRouter } from "./controllers";
import type { PostUser } from "./types";

const registerUserMock = mock(() => ({ id: 1 }));
mock.module("./services", () => ({
  registerUser: registerUserMock,
}));

const TEST_USER: PostUser = {
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  password: "hashtest",
  phoneNumber: "88888888545",
  cpf: "09876543211",
  birthDate: new Date("1973-03-03T09:46:40.000Z"),
  sex: "other",
};

describe("User Controllers Tests", () => {
  const app = new Elysia({ prefix: "/api/v1" })
    .use(userRouter);
  it("Should return 201 and user id", async () => {
    const req = new Request("http://localhost:5000/api/v1/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(TEST_USER),
    });

    const res = await app.handle(req);
    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json).toEqual({ id: 1 });
    expect(registerUserMock).toHaveBeenCalledWith(TEST_USER);

  });

});