import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  // Replace this with your own user data storage mechanism
  private users = [];

  async validateOAuthLogin(user: any): Promise<any> {
    // Validate the user and perform any necessary operations (e.g., creating a new user record)
    // based on the provided user data from the OAuth provider (e.g., Google)

    // In this example, we'll assume that the user is already registered and return the user object
    const existingUser = this.users.find(u => u.email === user.email);
    if (existingUser) {
      return existingUser;
    }

    // If the user is not registered, you can create a new user record in your database
    // and return the created user object
    const createdUser = {
      id: this.users.length + 1,
      ...user,
    };
    this.users.push(createdUser);
    return createdUser;
  }
}