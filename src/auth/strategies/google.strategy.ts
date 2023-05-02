import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import JwtPayload from '../payloads/jwtPayload';
import { appConfig, googleConfig } from 'src/configs/configs.constants';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    super({
      clientID: googleConfig.id,
      clientSecret: googleConfig.secret,
      callbackURL: `http://localhost:${appConfig.port}/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const email = profile.emails[0].value;

    const user = await this.usersService.getByEmail(email);

    if (!user) {
      await this.usersService.create({
        email,
        password: null,
      });
    }

    const payload: JwtPayload = { email };
    const jwtToken = await this.jwtService.signAsync(payload);

    done(null, { jwtAccessToken: jwtToken });
  }
}
