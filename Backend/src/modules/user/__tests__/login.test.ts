import { UserService } from "../../user/user.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IsNull } from "typeorm";

const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    passcode: "hashedPassword1",
    role: "admin",
    deleted_at: null
  },
  {
    id: "2",
    name: "Org User",
    email: "org@example.com",
    passcode: "hashedPassword2",
    role: "organization",
    deleted_at: null
  }
];
const mockUserRepository = {
  findOne: jest.fn(),
  save: jest.fn()
};

const mockOrgRepository = {
  query: jest.fn()
};

jest.mock("../../../database/data-source", () => ({
  __esModule: true,
  default: {
    getRepository: jest.fn().mockImplementation((entity) => {
      if (entity.name === 'User') {
        return mockUserRepository;
      }
      return mockOrgRepository;
    })
  }
}));

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe("UserService - login", () => {
  let userService: UserService;

  beforeEach(() => {
    jest.clearAllMocks();
    userService = new UserService();
    
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('mocked-token');
    process.env.JWT_SECRET = 'test-secret';
  });

  describe("Failure Cases", () => {
    test("should throw 'User Not found' when email doesn't exist", async () => {
  
      // mockUserRepository.findOne.mockResolvedValue(null);

      await expect(userService.login({
        email: "nonexistent@example.com",
        password: mockUsers[0].passcode
      })).rejects.toThrow("User Not found");

      
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { 
          email: "nonexistent@example.com",
          deleted_at: IsNull() 
        },
        select: ["id", "name", "email", "password", "role"]
      });
    });

    test("should throw 'Invalid Password' when password is wrong", async () => {
      
      mockUserRepository.findOne.mockResolvedValue(mockUsers[0]);
      
      // (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(userService.login({
        email: "admin@example.com",
        password: mockUsers[1].passcode
      })).rejects.toThrow("Invalid Password");
    });
  });

  describe("Success Cases", () => {
    test("should return token when credentials match", async () => {
      
      mockUserRepository.findOne.mockResolvedValue(mockUsers[0]);
      
      const result = await userService.login({
        email: "admin@example.com",
        password: mockUsers[0].passcode
      });
      
      expect(result).toEqual({ token: 'mocked-token' });
      
    });
  });
});