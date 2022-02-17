import { NotFoundException } from '@nestjs/common';
import { User } from './../auth/user.entity';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

jest.mock('../auth/user.entity.ts'); // had to do this, cuz typescript kept complaining about that passed object has to be of type user.
const mockUser: User = new User();
mockUser.id = 1;

describe('Tasks Service', () => {
  let tasksService: TasksService;
  let taskRepository; // we don't want to use the application repo cuz this is unit testing (we don't want to touch the bd), we gonna have to mock it.

  beforeEach(async () => {
    // reinitialize service and reinitialize the repo for us to run test cases independently
    const module = await Test.createTestingModule({
      // to create a new module for testing, similar to creating any module in nestjs
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('get Tasks', () => {
    it('gets all tasks from the repository', async () => {
      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      const mockedReturnedValue = 'some return value';
      taskRepository.getTasks.mockResolvedValue(mockedReturnedValue); // to simulate its Promise returning https://stackoverflow.com/questions/60024855/typescript-not-assignable-to-type-never-error-on-entity-in-jests-mockresolv#:~:text=synchronous%20function%2C%20but-,mockResolvedValue,-is%20for%20asynchronous
      const filter: getTasksFilterDto = {
        search: 'Some query',
        status: TaskStatus.IN_PROGRESS,
      };
      const result = await tasksService.getTasks(filter, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual(mockedReturnedValue);
    });
  });

  describe(' get task by id ', () => {
    it('calls TaskRepository.findOne() and successfully retrieve and return the task', async () => {
      const mockedReturnedValue = {
        title: 'test task',
        descrption: 'test desc',
      };
      taskRepository.findOne.mockResolvedValue(mockedReturnedValue);
      const result = await tasksService.getTaskById(1, mockUser);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
      expect(result).toEqual(mockedReturnedValue);
    });
    it('throws an error as task is not found', async () => {
      taskRepository.findOne.mockResolvedValue(null);
      await expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      ); // cuz we return a promise, and the promise will be rejected. // jest gonna catch a reject exception
    });
  });

  describe('create task', () => {
    it('create a task give a task dto', async () => {
      const taskDto = {
        title: 'test task',
        description: 'test desc',
      };
      const mockedReturnedValue = {
        id: 2,
        title: 'test task',
        descrption: 'test desc',
        status: TaskStatus.OPEN,
        userId: mockUser.id,
      };
      taskRepository.createTask.mockResolvedValue(mockedReturnedValue);
      const result = await tasksService.createTask(taskDto, mockUser);
      expect(taskRepository.createTask).toHaveBeenCalledWith(taskDto, mockUser);
      expect(result).toEqual(mockedReturnedValue);
    });
  });

  describe('delete task', () => {
    it('delete a task given a task id', async () => {
      const mockedReturnedValue = { affected: 1 };
      taskRepository.delete.mockResolvedValue(mockedReturnedValue);
      await tasksService.deleteTask(1, mockUser);
      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      });
    });
    it('throw an error as task id could not be found', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update task', () => {
    it('delete a task given a task id and new status', async () => {
      const save = jest.fn().mockResolvedValue(true);
      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.IN_PROGRESS,
        save: save,
      });
      const result = await tasksService.UpdateTask(
        1,
        TaskStatus.DONE,
        mockUser,
      );
      expect(tasksService.getTaskById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE);
    });
  });
});
