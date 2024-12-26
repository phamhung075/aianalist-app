import { Request, Response, NextFunction } from 'express';
import { isEmpty } from 'lodash';
import { bgMagenta, bgWhite, blue, blueBright, greenBright, yellow } from 'colorette';



export function showRequestUrl(req: Request, res: Response, next: NextFunction): void {
    const timestamp = new Date().toLocaleString();
    console.log(bgWhite("\n" + "showRequestUrl: " + timestamp));
    
    try {
        if (!isEmpty(req.originalUrl)) {
            console.log('Request URL:', `${blueBright(req.headers.host ?? 'host_not_found')}${blue(req.originalUrl)}`);
        }
        
        if (!isEmpty(req.method)) {
            console.log('Method:', yellow(req.method));
        }
        
        if (!isEmpty(req.body)) {
            console.log('Body:', greenBright(JSON.stringify(req.body, null, 2)));
        }
        
        if (!isEmpty(req.params)) {
            console.log('Params:', JSON.stringify(req.params, null, 2));
        }
        
        if (!isEmpty(req.query)) {
            console.log('Query:', JSON.stringify(req.query, null, 2));
        }
        
        console.log(bgMagenta("\n"));
    } catch (error) {
        console.error('Error in showRequestUrl middleware:', error);
    }
    
    next();
}