import { AuthModule } from './../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TaskRepository]), AuthModule], // means everything that is exported in the authModule will be availbe in the TaskModule
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
