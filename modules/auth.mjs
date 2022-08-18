import express from 'express'
import passport from 'passport'
import { Strategy as YandexStrategy } from 'passport-yandex'
import { clientID, clientSecret } from '../config.mjs'

const tokens = {}

function passportInit() {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(new YandexStrategy({
      clientID,
      clientSecret,
      callbackURL: "/auth/yandex/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      setInterval(function () {
        return done(null, profile);
      })
    }
  ))
}

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ user: req.user, session: req.session })
})
router.get('/yandex/callback',
  passport.authenticate('yandex', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/')
  }
);

export {
  passportInit,
  router
}
