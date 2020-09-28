import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";

@Injectable()
export class RestHttpInterceptor implements HttpInterceptor {
 

    token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';


    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.token;
        req = req.clone({
            setHeaders: {
                Authorization: "Bearer " + authToken
            }
        });
         

        // console.log("req object: ", req);

        return next.handle(req);
    }
}