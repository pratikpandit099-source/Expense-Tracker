import { User, IUserDocument } from '../models/User.js';

export class UserRepository {
  async findByEmail(email: string): Promise<IUserDocument | null> {
    return User.findOne({ email: email.toLowerCase().trim() });
  }

  async findById(id: string): Promise<IUserDocument | null> {
    return User.findById(id);
  }

  async create(userData: { name: string; email: string; passwordHash: string }): Promise<IUserDocument> {
    return User.create({
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      passwordHash: userData.passwordHash,
      tokenVersion: 0,
    });
  }

  async incrementTokenVersion(userId: string): Promise<IUserDocument | null> {
    return User.findByIdAndUpdate(
      userId,
      { $inc: { tokenVersion: 1 } },
      { new: true }
    );
  }
}

export const userRepository = new UserRepository();
