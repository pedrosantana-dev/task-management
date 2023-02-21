import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskStatus } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>
    ) { }

    async getAllTasks(user: User) {
        const query = this.taskRepository.createQueryBuilder('tasks');
        query.where('tasks.userId = :userId', { userId: user.id });

        try {
            return await query.getMany()
        } catch (error) {
            return new NotFoundException('Nenhuma tarefa encontrada')
        }
    }

    async createTask(data: any, user: any) {
        const { title, description } = data;
        const task: Task = new Task;
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.userId = user.id;

        try {
            return await this.taskRepository.save(task);
        } catch (error) {
            throw new InternalServerErrorException('Algo deu errado, tarefa não foi criada')
        }
    }

    async updateTask(id: number, status: TaskStatus, user: any) {
        try {
            await this.taskRepository.update({ id, userId: user.id }, { status })
            return await this.taskRepository.findOneBy({ id: id, userId: user.id });
        } catch (error) {
            throw new InternalServerErrorException('Algo deu errado, tarefa não atualizada');
        }
    }

    async deleteTask(id: number, user: any) {
        const result = await this.taskRepository.delete({ id, userId: user.id });

        if (result.affected === 0) {
            throw new NotFoundException('Tarefa não encontrada');
        } else {
            return { success: true };
        }
    }
}
