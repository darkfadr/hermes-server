import fs from 'fs';
import os from 'os';
import path from 'path';
import uuid from 'uuid/v1';
import EventEmiter from 'events';
import {SMTPServer } from 'smtp-server'; //docs:  https://nodemailer.com/extras/smtp-server/
import {MailParser} from 'mailparser';
import log from './logger';


export default class MailServer extends EventEmiter {
  constructor({port=1025, host='0.0.0.0', user, password, tempDir='tmp'}){
    super();
    this.host = host;
    this.port = port;
    this.store = {};
    this.tempDir = tempDir;

    const smtp = new SMTPServer({
      logger: true, //maybe make configurable
      disabledCommands: (user && password) && ['STARTTLS'] || ['AUTH'], //TODO: expand add authentication mechanisms
      onData: this.handleDataStream
    })

    smtp.on('error', e => {
      log.error(`Could not start mail server on ${e.address}:${e.port}\nPort already in use or insufficient rights to bind port`);
      process.emit('SIGTERM');
    });

    this.setupTempDir(this.tempDir);
    this.smtp = smtp // testability requires this to be exposed. otherwise we cannot test whether error handling works
  }


  saveEmail(id, envelope, mail) {
    // remove stream object from attachments (fix the JSON.stringify)
    if (mail && mail.attachments instanceof Array)
      mail.attachments.forEach(attachment => delete attachment.stream)

      const email = Object.assign({}, mail, {
      time: new Date(),
      read: false,
      source: path.join(this.tempDir, `${id}.eml`),
      envelope
    })
    this.store[id] = email;

    log.info(`Saving email: ${email.subject}`);

    //TODO: add functionality to relay email to actual source when certain criterias are met
    // if (outgoing.isAutoRelayEnabled()) {
    //   mailServer.relayMail(object, true, function (err) {
    //     if (err) log.error('Error when relaying email', err)
    //   })
    // }

    this.emit('new', email);
  }

  saveAttachment = (attachement) => {
    const output = fs.createWriteStream(path.join(this.tempDir, attachment.contentId))
    attachment.stream.pipe(output)
  };

  handleDataStream = (stream, session, callback) => {
    const id = uuid()
    const { hostNameAppearsAs: host, remoteAddress} = session;
    const {mailFrom: from, rcptTo: to} = session.envelope;

    log.debug('Receiveing STMP stream to parse.');
    const parseStream = new MailParser({ streamAttachments: true });
    parseStream.on('end', () => this.saveEmail(id, {from, to, host, remoteAddress}, session));
    parseStream.on('attachment', this.saveAttachment);

    session.saveStream = parseStream;
    session.saveRawStream = fs.createWriteStream(path.join(this.tempDir, `${id}.eml`));

    stream.pipe(session.saveStream)
    stream.pipe(session.saveRawStream)

    stream.on('end', () => {
      log.debug('Message stream ended');
      session.saveRawStream.end()
      callback(null, `Message queued as ${id}`);
    });
  }

  //where attachements will live
  setupTempDir(tempDir){
    if (!fs.existsSync(path.dirname(tempDir))) {
      fs.mkdirSync(path.dirname(tempDir))
      log.info('Temporary directory created at %s', path.dirname(tempDir))
    }

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir)
      log.info('Temporary directory created at %s', tempDir)
    }
  }

  listen = (cb) => this.smtp.listen(this.port, this.host, cb)

  close(){
    return new Promise((resolve, reject) => {
      this.emit('close');
      this.smtp.close(resolve)
    });
  }
}

