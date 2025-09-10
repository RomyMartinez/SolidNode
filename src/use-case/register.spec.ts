import { expect, describe, it, beforeEach } from "vitest";
import { compare } from "bcryptjs";
import { RegisterUseCase } from "./register";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistError } from "./errors/user-already-exist-error";

let prismaUsersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    prismaUsersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(prismaUsersRepository);
  });

  it("should be able to register a new user", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456",
    });

    expect(user).toBeDefined();
    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("john.doe@example.com");
    expect(user.password_hash).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "John Doe2",
      email: "john.doe3@example.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    await sut.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456",
    });

    await expect(
      sut.execute({
        name: "John Doe",
        email: "john.doe@example.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistError);
  });
});
