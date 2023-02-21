import { UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { InjectRepository } from "@nestjs/typeorm"
import { ExtractJwt, Strategy } from "passport-jwt"
import { User } from "src/entities/user.entity"
import { Repository } from "typeorm"

export class JwtCustomStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'CHAVE_SECRETA_PARA_JWT'
        })
    }

    async validate(payload: { username: string }) {
        const { username } = payload;
        const user = await this.userRepository.findOneBy({ username });

        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }

}