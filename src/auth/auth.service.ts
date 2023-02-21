import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async register(data: any) {
        const { username, password } = data;
        const user: User = new User;
        user.username = username;
        user.password = password;

        try {
            return await this.userRepository.save(user)
        } catch (error) {
            return new InternalServerErrorException('Algo deu errado, usuário não foi criado!')
        }
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
