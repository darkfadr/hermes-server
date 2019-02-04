import fs from 'fs';
import api from './api';
import log from './logger';
import SMTP from './mailserver';
// import mongoose from './bootstrap';

const { PORT=3000, APP_NAME, SMTP_PORT: port, SMTP_HOST: host} = process.env;
api.listen(PORT, () => log.info(`${APP_NAME} is up & running on port: ${PORT}`));

const mailserver = new SMTP({port, host});
mailserver.listen(res => log.info(`Ready to start receiving emails.`));
