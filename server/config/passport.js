import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';

const configurePassport = () => {
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (payload, done) => {
        try {
          const user = await User.findById(payload.id);
          if (user) return done(null, user);
          return done(null, false);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            let user = await User.findOne({ googleId: profile.id });
            if (!user) {
              user = await User.findOne({ email: profile.emails[0].value });
              if (user) {
                user.googleId = profile.id;
                user.isVerified = true;
                await user.save();
              } else {
                user = await User.create({
                  name: profile.displayName,
                  email: profile.emails[0].value,
                  googleId: profile.id,
                  avatar: profile.photos?.[0]?.value || '',
                  isVerified: true,
                });
                await Profile.create({ user: user._id });
              }
            }
            return done(null, user);
          } catch (err) {
            return done(err, false);
          }
        }
      )
    );
  }
};

export const googleAuthRoutes = (app) => {
  app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
  app.get(
    '/api/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=google` }),
    (req, res) => {
      const token = generateAccessToken(req.user._id);
      const refreshToken = generateRefreshToken(req.user._id);
      req.user.refreshToken = refreshToken;
      req.user.save({ validateBeforeSave: false });
      res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&refreshToken=${refreshToken}`);
    }
  );
};

export default configurePassport;
