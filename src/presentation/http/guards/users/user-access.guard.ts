import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserAccessTokenGuard extends AuthGuard('access-token') {}
