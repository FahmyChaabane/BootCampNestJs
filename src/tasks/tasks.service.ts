import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) // to tell Nest that inside typeorm we have a TaskRepository to inject here
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: getTasksFilterDto): Promise<Task[]> {
    return await this.taskRepository.getTasks(filterDto);
  }

  async getTaskById(id: number): Promise<Task> {
    // any asynchronous operation is expected to return a promise not just a plain value, it must be a promise, otherwise TS will complain
    const found = await this.taskRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto);
  }

  async deleteTask(id: number): Promise<void> {
    /* Promise<Task> would be the returned value
    const found = await this.getTaskById(id);
    return await this.taskRepository.remove(found);
    */
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async UpdateTask(id: number, status: TaskStatus): Promise<Task> {
    /* Promise<void> would be the returned value
    const result = await this.taskRepository.update(id, { status });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    */
    const found = await this.getTaskById(id);
    found.status = status;
    return await found.save();
  }
}
