import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { ApiAiClient } from 'api-ai-javascript';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class Message {
  public imageUrl: string;
  public showimage: string;
  public videoUrl: string;
  public showvideo: string;
  public pdfpath: string;
  public showpdf: string;
  public pdfname: string;
  public wordpath: string;
  public showword: string;
  public wordname: string;

  constructor(public content: string, public sentBy: string,messagetype:string) {
    this.showimage = 'false';
    this.showvideo = 'false';
    this.showpdf = 'false';
    this.showword = 'false';
    //alert(sentBy);
    if (sentBy === 'bot' && messagetype==='custommessage') {
      // if(content==='Say that again?' || content==='Sorry, could you say that again?')
      // {
      //   this.content="Please enter a valid question ";
      // }
      // else 
      // {
      content = '{' + content + '}';
     // alert(content);
     // if(content)
      var result = JSON.parse(content);
      this.content = ' ' + result.Text;

      if (result.hasOwnProperty('hasimage')) {
        if (result.hasimage === 'true') {
          this.showimage = 'true';
          this.imageUrl = result.imagepath;
        }
        else {
          this.showimage = 'false';
          this.imageUrl = null;
        }
        if (result.hasvideo === 'true') {
          this.showvideo = 'true';
          // alert(result.videoUrl);
          this.videoUrl = result.videoUrl;
        }
        if (result.haspdf === 'true') {
          this.showpdf = 'true';
          this.pdfpath = result.pdfpath;
          this.pdfname = result.pdfpath.replace("../../../assets/images/", "");
        }
        if (result.hasword === 'true') {
          this.showword = 'true';
          this.wordpath = result.wordpath;
          this.wordname = result.wordpath.replace("../../../assets/images/", "");
        }
      }
      else {
        this.content = "good question, we will get back with an answer."
        this.sentBy = 'bot';
        this.imageUrl = null;
      }
    }
    else 
    {
      if (sentBy==='bot')
      {
        this.content = "good question, we will get back with an answer."
        this.sentBy = 'bot';
      }
    }

  }


}
@Injectable()
export class ChatService {

  readonly token = environment.dialogflow.angularBot;
  readonly client = new ApiAiClient({ accessToken: this.token });

  conversation = new BehaviorSubject<Message[]>([]);

  constructor() { }

  // Sends and receives messages via DialogFlow
  converse(msg: string) {
    const userMessage = new Message(msg, 'user','custommessage');
    if (msg === 'summary') {

    }
    else {
      this.update(userMessage);
    }
    // return this.client.eventRequest()
    return this.client.textRequest(msg)
      .then(res => {
      //  alert(res.result.fulfillment.speech);
        //  if(res.result.fulfillment.speech==='Say that again?')
        //  {
        //   const botMessage = new Message('Say that again?', 'bot');
        //   this.update(botMessage);
        //  }
        //  else {
        const speech = res.result.fulfillment.speech;

       //console.log(res.result);
      // console.log(speech);

      if(speech.includes('"hasimage"'))
      {
                //alert(res.result.fulfillment.speech);
               // alert('1');
        const botMessage = new Message(speech, 'bot','custommessage');
        this.update(botMessage);
      }
      else 
      {
        const botMessage = new Message(speech, 'bot','Dialogflowmessage');
        this.update(botMessage);
      }
        //  }
      });
  }

  // Adds message to source
  update(msg: Message) {
    this.conversation.next([msg]);
  }


}
