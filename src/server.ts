import app from './app';

/**
 * port configuration and server startup
 */
const server = app.listen(app.get('port'), async () => {
    console.log('Server Started on', app.get('port'));
});

export default server;
