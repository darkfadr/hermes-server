import express from 'express';
import log from '../logger';
import { EmailController } from './controllers';

const temp = (req, res) => res.json({status: 'success', msg: 'Method not yet implemented'});
const get = temp;
const post = temp;
const put = temp;

const router = express.Router();

router.map = routes => {
  Object.keys(routes).forEach(path => {
    const route = router.route(path);
    Object.keys(routes[path])
      .forEach(action =>route[action](routes[path][action]) || temp)
  });
}

router.map({
  '/healthcheck': {get},

  '/config': {get},

  '/email': {get, delete: temp},
  '/email/:id': {get, delete: temp},
  '/email/:id/html': {get},
  '/email/:id/source': {get},
  '/email/:id/download': {get},
  '/email/:id/attachement/:filename': {get},
  // '/email/:id/relay/:destination': {post}   //experimental

});

export default router;

