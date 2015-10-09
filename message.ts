/// <reference path='./typings/node/node.d.ts' />
/// <reference path='./typings/request/request.d.ts' />
import request = require('request');
import Consts = require('./consts');
import SkypeAccount = require('./skype_account');
import Utils = require('./utils');
import http = require('http');
import {CookieJar} from "request";
'use strict';

class MessageService {
    private requestWithJar;

    constructor(cookieJar:CookieJar) {
        this.requestWithJar = request.defaults({jar: cookieJar});
    }

    private send(messageBody: string, skypeAccount: SkypeAccount, conversationId: string) {
        this.requestWithJar.post(Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/users/ME/conversations/' + conversationId + '/messages', {
            body: requestBody,
            headers: {
                'RegistrationToken': skypeAccount.registrationTokenParams.raw
            }
        }, (error:any, response:http.IncomingMessage, body:any) => {
            if (!error && response.statusCode === 201) {
                //fixme? send success callback?
            } else {
                Utils.throwError('Failed to send message.');
            }
        });
    }

    public sendMessage(skypeAccount:SkypeAccount, conversationId:string, message:string) {
        var requestBody = JSON.stringify({
            'clientmessageid': Date.now(),
            'content': message,
            'messagetype': 'RichText',
            'contenttype': 'text'
        });
        console.log('sending message ' + requestBody);
        this.send(requestBody, skypeAccount, conversationId);
    }

    public editMessage(skypeAccount: SkypeAccount, conversationId: string, message: string) {
        var requestBody = JSON.stringify({
            'skypeeditedid': Date.now(),
            'content': message,
            'messagetype': 'RichText',
            'contenttype': 'text'
        });
        console.log('editing message ' + requestBody);
        this.send(requestBody, skypeAccount, conversationId);
    }
}

export = MessageService;
