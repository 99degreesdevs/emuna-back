import { Injectable } from '@nestjs/common';
import { MailerService  } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
const handlebars = require('handlebars');
const { promisify } = require('util');
const fs = require('fs');
const path = require('node:path'); 
@Injectable()
export class MailService {
    constructor( 
        private mailerService: MailerService,
    ){}

    async recoverPassword(correo: string, link: string, hash: string, origen: string){
        
        const readFile = promisify(fs.readFile);
        const dir = path.resolve(__dirname, '../../src/mail');

        let html = await readFile(`${dir}/templates/validacion_short.html`,'utf8');
        let template = handlebars.compile(html);
        let mensaje = 'Introduce el código de verificación para restablecer tu contraseña';
        mensaje +=  (origen === 'WEB')?' o da clic en el siguiente botón:' : '.';
        let data = {
            app: 'Emuná',
            brand: 'Emuná - Estudio',
            onlyname: 'Emuná', 
            team: 'Equipo de Emuná',
            hash: hash,
            link: link,
            txtbutton: 'Restablecer Password',
            login: 'https://emuna.mx',
            contacto: 'contacto@emuna.com.mx',
            saludo: mensaje,
            tipo: 'Recuperación de Passoword', 
            button: (origen === 'WEB')?'':'none',
            text1: '',
            text2: '',
            banner: `https://emuna.mx/wp-content/uploads/2023/09/sun.png`,
            icon: `https://emuna.mx/wp-content/uploads/2022/04/logo-emuna.png`,
            year: new Date().getFullYear(),
            conditions: `${process.env.CONDITIONS}`,
            home: `${process.env.HOME}`,
            tel: `${process.env.TEL}`,
            youtube: `${process.env.YOUTUBE}`,
            youtube_img: `${process.env.YOUTUBEIMG}`,
            facebook: `${process.env.FACEBOOK}`,
            facebook_img: `${process.env.FACEBOOKIMG}`,
            twitter: `${process.env.TWITER}`,
            twitter_img: `${process.env.TWITERIMG}`
        };
        let htmlToSend = template(data);
 
        await this.mailerService.sendMail({
            from: '"Emuná" <noreplay@emuna.com>',
            to: correo,
            subject: "Recuperación de Contraseña: " + hash,
            text: "Código de Validación:" + hash,
            html: htmlToSend
        }).then(e=>{
            return {
                status: true, 
                message: 'Se envió el correo correctamente.'
            }
           
        }).catch(
            error=>{
                console.log(error)
                return {
                    status: false
                }
            }
        )
    }

    async updatedPassword(correo: string ){
        
        const readFile = promisify(fs.readFile);
        const dir = path.resolve(__dirname, '../../src/mail');

        let html = await readFile(`${dir}/templates/notificacion.html`,'utf8');
        let template = handlebars.compile(html);

        let data = {
            app: 'Emuná',
            brand: 'Emuná Estudio',
            onlyname: 'Emuná', 
            team: 'Equipo de Emuná',
            link: '',
            button: 'none',
            txtbutton: '',
            contacto: 'contacto@emuna.com.mx',
            text1: 'Actualización de Password',
            text2: 'Se actualizó el password correctamente.',
            banner: `https://emuna.mx/wp-content/uploads/2023/09/tarot.png`,
            icon: `https://emuna.mx/wp-content/uploads/2022/04/logo-emuna.png`,
            year: new Date().getFullYear(),
            conditions: process.env.CONDITIONS,
            home: `${process.env.HOME}`,
            tel: `${process.env.TEL}`,
            youtube: `${process.env.YOUTUBE}`,
            youtube_img: process.env.YOUTUBEIMG,
            facebook: `${process.env.FACEBOOK}`,
            facebook_img: `${process.env.FACEBOOKIMG}`,
            twitter: `${process.env.TWITER}`,
            twitter_img: `${process.env.TWITERIMG}`
        };
        let htmlToSend = template(data);
 
        await this.mailerService.sendMail({
            from: '"Emuná" <noreplay@emuna.com>',
            to: correo,
            subject: "Actualización de password exitoso",
            text: "Notificación: Actualización de Password",
            html: htmlToSend
        }).then(e=>{
            return {
                status: true, 
                message: 'Se envió el correo correctamente.'
            }
           
        }).catch(
            error=>{
                console.log(error)
                return {
                    status: false
                }
            }
        )
    }
}
