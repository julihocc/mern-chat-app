// path: frontend\src\logger.js
import log from 'loglevel';

// if (process.env.NODE_ENV === 'production') {
//     log.setLevel('error');
// } else {
//     log.setLevel('debug');
// }

log.setLevel('debug');

export default log;
