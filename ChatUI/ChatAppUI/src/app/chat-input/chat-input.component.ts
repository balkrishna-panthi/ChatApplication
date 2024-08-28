import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css']
})
export class ChatInputComponent implements OnInit{
  @Output() contentEmitter = new EventEmitter();
  ngOnInit(): void {
   
  }
  content:string ="";
sendMessage(){
if(this.content.trim() !==""){
this.contentEmitter.emit(this.content);
}
this.content="";
}
}
