import { UsersRepository } from "../users-repository";
import { User, Prisma } from "@/generated/prisma";

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = [];

  async findByEmail(email: string) {
    const user = this.users.find((user) => user.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = {
      id: "user-1",
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      createdAt: new Date(),
    };
    this.users.push(user);

    return user;
  }
}
