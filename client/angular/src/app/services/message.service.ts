import { Injectable } from '@angular/core';
import { LogMsg } from '../classes/logMsg';
@Injectable({
    providedIn: 'root',
})
export class MessageService {
    private messages: LogMsg[] = [];

    add(message: string) {
        const data = {
            datestamp: new Date(),
            message
        };
        this.messages.push(data);
    }
    display(): void {
        console.table(this.messages);
    }
    clear() {
        this.messages = [];
    }
}
