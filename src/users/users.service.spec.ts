import { UsersService } from './users.service';
import { Model, Query } from 'mongoose';
import { User } from '../types/user';
import { createMock } from '@golevelup/nestjs-testing';
import { mockUserDoc } from '../utils/test-utils';
import { UserDTO } from './user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  beforeEach(async () => {
    model = createMock<Model<User>>({});
    service = new UsersService(model);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getById', () => {
    it('Should return an user', async () => {
      const inputId = 'id2';
      const userDocWithId = usersDocList.find((user) => (user.id = inputId));
      jest.spyOn(model, 'findById').mockResolvedValueOnce(userDocWithId as User);
      const returnedUser = await service.findById(inputId);
      expect(returnedUser).toEqual(userDocWithId);
    });

    it('Should return undefined', async () => {
      const inputId = '432987532';
      jest.spyOn(model, 'findById').mockResolvedValueOnce(undefined);
      const returnedUser = await service.findById(inputId);
      expect(returnedUser).toEqual(undefined);
    });
  });

  describe('create', () => {
    it('Should return id after creating user', () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce(
        createMock<Query<User, User>>({
          exec: jest.fn().mockResolvedValueOnce(null),
        }),
      );
      jest.spyOn(model, 'create').mockReturnValueOnce(newUser as any);
      expect(service.create(newUser)).resolves.toEqual(newUser);
    });

    it('Should return null if user already exists', () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValueOnce(mockUserDoc() as any);
      expect(service.create(mockUser())).resolves.toEqual(null);
    });
  });

  describe('findByEmail', () => {
    it('Returns user', () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce(
        createMock<Query<User, User>>({
          exec: jest.fn().mockResolvedValueOnce(usersDocList[0] as any),
        }),
      );
      expect(service.findByEmail('email@test.com')).resolves.toEqual(usersDocList[0]);
    });

    it('Returns null if user does not exists', () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce(
        createMock<Query<User, User>>({
          exec: jest.fn().mockResolvedValueOnce(null),
        }),
      );
      expect(service.findByEmail('NotExistingEmail')).resolves.toBe(null);
    });
  });

  describe('updateUserData', () => {
    it('Returns updated user', () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce(usersDocList[1] as any);
      expect(service.updateUserData(usersList[1])).resolves.toEqual(usersDocList[1]);
    });
  });

  describe('updatePassword', () => {
    it('Returns updated user', () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce(usersDocList[1] as any);
      expect(service.updatePassword('id', 'password')).resolves.toEqual(usersDocList[1]);
    });
  });

  describe('deleteUser', () => {
    it('Returns deleted user', () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValueOnce(usersDocList[1] as any);
      expect(service.deleteUser('id')).resolves.toEqual(usersDocList[1]);
    });
  });
});

const mockUser = (username = 'username', password = 'password', id = 'id', email = 'email@test.com'): UserDTO => {
  return {
    username,
    password,
    id,
    email,
  };
};

const newUser = mockUser('test4', 'password4', 'id4', 'email4@test.com');

const usersList = [
  mockUser(),
  mockUser('test2', 'password2', 'id2', 'email2@test.com'),
  mockUser('test3', 'password3', 'id3', 'email3@test.com'),
];

const usersDocList = [mockUserDoc(), mockUserDoc(usersList[1]), mockUserDoc(usersList[2])];
