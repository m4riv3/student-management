const app = require('./app');
const spdy = require('spdy');
spdy.server.create(app.listen(3001, () => console.log('server running at 3001')));