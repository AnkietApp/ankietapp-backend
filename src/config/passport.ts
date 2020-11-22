import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { getRepository } from 'typeorm';

import User from '../entity/User';
import { JWT_SECRET } from '../utils/secrets';

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
};

export default new Strategy(opts, async (payload, done) => {
  try {
    const user = await getRepository(User).findOne(payload.id);
    if (user) {
      return done(null, user);
    }

    return done(null, false);
  } catch (error) {
    return done(error);
  }
});
