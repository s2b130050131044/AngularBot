import { Component, OnInit } from '@angular/core';
import { ChatService, Message } from '../chat.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/scan';

@Component({
  selector: 'chat-dialog', 
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.scss']
  
})
export class ChatDialogComponent implements OnInit {

  messages: Observable<Message[]>;
  formValue: string;

  constructor(public chat: ChatService) { }

  ngOnInit() {
    // appends to array after each new message is added to feedSource
    this.messages =new Observable<Message[]>();
 //   public content: string, public sentBy: string
   // this.messages(new Message("","bot"));
    this.messages = this.chat.conversation.asObservable()
        .scan((acc, val) => acc.concat(val) );
        
        // this.sendMessage();
        // this.formValue="";
  }

  ngAfterViewInit(){
     this.formValue="summary";
         this.sendMessage();
         this.formValue="";
  }
  sendMessage() {
 if (this.formValue.trim()==='')
 {
   alert('Please Enter Something');
   return;
 }
    this.chat.converse(this.formValue);
    this.formValue = '';
  }
}
