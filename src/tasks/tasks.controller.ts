import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/current-user.decoretor';
import { TaskStatus } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Get()
    getAllTasks(@CurrentUser() user: User) {
        return this.tasksService.getAllTasks(user);
    }

    @Post()
    createTask(@Body() data: any, @CurrentUser() user: User) {
        return this.tasksService.createTask(data, user);
    }

    @Patch(':id')
    updateTask(
        @Body('status') status: TaskStatus,
        @Param('id') id: number,
        @CurrentUser() user: User
    ) {
        return this.tasksService.updateTask(id, status, user);
    }

    @Delete(':id')
    deleteTask(
        @Param('id') id: number,
        @CurrentUser() user: User,
    ) {
        return this.tasksService.deleteTask(id, user);
    }
}
