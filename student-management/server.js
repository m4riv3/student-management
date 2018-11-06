const app = require('./app');
const spdy = require('spdy');
spdy.createServer(app.listen(3030, () => {
    console.log('Server is running on port 3030');
}))