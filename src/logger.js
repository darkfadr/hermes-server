import winston, { format } from 'winston';
require('winston-daily-rotate-file');

// const path = `${__dirname}/logs`;
// !fs.existsSync(path) && fs.mkdirSync(path)

const logger = winston.createLogger({
  transports: [
    // new winston.transports.DailyRotateFile({
    //   filename: `${__dirname}/logs/%DATE%.log`,
    //   datePattern: 'YYYY-MM-DD',
    //   prepend: true,
    //   createTree: true,
    //   handleExceptions: false,
    //   format: format.combine(
    //     format.timestamp(),
    //     format.json()
    //   )
    // }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.cli()
      )
    })
  ]
});

logger.stream = {
  write: (message, encoding) => logger.verbose(message)
};

export default logger;
