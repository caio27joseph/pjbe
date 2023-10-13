import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req, connection, account } = ctx.getContext();

    // If it's an HTTP request (query/mutation)
    if (req) {
      try {
        return (await super.canActivate(context)) as boolean;
      } catch (e) {
        throw new UnauthorizedException('Invalid Token');
      }
    }

    // If it's a WebSocket (subscription)
    if (connection || account) {
      const user =
        account ||
        (connection && (connection.context.user || connection.context.account));
      if (!user) {
        throw new UnauthorizedException('Invalid Token');
      }
      return true;
    }

    // If neither req nor connection/account is present, deny access
    throw new UnauthorizedException('Invalid Token');
  }
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const { req, connection, account } = ctx.getContext();

    if (req) {
      return req;
    }

    if (connection) {
      return connection.context;
    }

    if (account) {
      return { account };
    }
  }
}
