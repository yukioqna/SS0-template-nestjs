import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from 'src/modules/users/users.service';
import AuthCreadentialsDto from './dto/auth-credentials.dto';
import JwtPayload from './payloads/jwtPayload';
import { AuthMessage } from './auth.constants';
import TokenResponseDto from './dto/token-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Sign up an user.
   * @param authCredentialsDto AuthCredentialDto.
   */
  async signUp(
    authCredentialsDto: AuthCreadentialsDto,
  ): Promise<TokenResponseDto> {
    await this.usersService.create(authCredentialsDto);
    const payload: JwtPayload = { email: authCredentialsDto.email };
    const jwtAccessToken = await this.jwtService.signAsync(payload);
    return { jwtAccessToken };
  }

  /**
   * Sign in an user.
   * @param authCredentialsDto AuthCredentialsDto.
   */
  async signIn(
    authCredentialsDto: AuthCreadentialsDto,
  ): Promise<TokenResponseDto> {
    const { email, password } = authCredentialsDto;
    const user = await this.usersService.getByEmail(email);

    // If user with email exist and the password is valid.
    if (user && (await user.validatePassword(password))) {
      const payload: JwtPayload = { email };
      const jwtAccessToken = await this.jwtService.signAsync(payload);

      return { jwtAccessToken };
    }
    // Else return an error.
    throw new BadRequestException(AuthMessage.INVALID_CREDENTIALS);
  }

  async externalSignIn(req: Request): Promise<Express.User> {
    return req.user;
  }
}
