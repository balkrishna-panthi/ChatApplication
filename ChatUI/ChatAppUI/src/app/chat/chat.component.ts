import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrivateChatComponent } from '../private-chat/private-chat.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit , OnDestroy{
  @Output() closeChatEmitter = new EventEmitter();
  ngOnInit(): void {
    
    this.chatService.createChatConnection();
  }
  constructor(public chatService :ChatService  , private modalService : NgbModal){

  }
  ngOnDestroy(): void {
   this.chatService.stopConnection();
  }
  backToHome(){
    this.closeChatEmitter.emit();
  }

  sendMessage(content:string){
    this.chatService.sendMessage(content);
  }

  openPrivateChat(toUser:string){
    const modalRef = this.modalService.open(PrivateChatComponent);
    modalRef.componentInstance.toUser = toUser
  }
}
