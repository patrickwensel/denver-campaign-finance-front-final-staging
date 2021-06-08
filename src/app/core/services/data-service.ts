import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable()
export class DataService {

  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message)
  }

}
@Injectable()
export class TransferDataService {

private changeType: Subject<any> = new Subject();
openModal = this.changeType.asObservable().pipe(shareReplay());

constructor() { }

  changeData(data: any) {
    this.changeType.next(data)
  }
}
@Injectable()
export class NotificationAction {
    private subject = new Subject<any>();
    sendAction(data: any) {
        // console.log('NotificationAction');
        this.subject.next(data);
    }
    clearEvent() {
        this.subject.next();
    }
    listenAction(): Observable<any> {
        return this.subject.asObservable();
    }
}
