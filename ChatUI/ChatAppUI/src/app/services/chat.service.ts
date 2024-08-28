import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Messages } from '../models/messages';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrivateChatComponent } from '../private-chat/private-chat.component';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  myName: string = ' ';
  private chatConnection?: HubConnection;
  onlineUsers: string[] = [];
  messages: Messages[] = [];
  privateMessages: Messages[] = [];
  privateMessageInitiated = false;


  constructor(private httpClient: HttpClient, private modalService: NgbModal) { }

  registerUser(user: User) {
    return this.httpClient.post('http://localhost:5167/' + 'api/chat/register-user', user, { responseType: 'text' })
  }
  createChatConnection() {
    this.chatConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5167/' + 'hubs/chat').withAutomaticReconnect().build();

    this.chatConnection.start().catch(error => {
      console.log(error + "I have a error");
    });

    this.chatConnection.on('UserConnected', () => {
      this.addUserConnectionId();
    });
    this.chatConnection.on('OnlineUsers', (onlineUsers) => {
      this.onlineUsers = [...onlineUsers]; //spread operator
    });
    this.chatConnection.on('NewMessage', (newMessage: Messages) => {
      this.messages = [...this.messages, newMessage];
    });

    this.chatConnection.on('OpenPrivateChat', (newMessage: Messages) => {
      this.privateMessages = [...this.privateMessages, newMessage];
      this.privateMessageInitiated = true;
      const modalRef = this.modalService.open(PrivateChatComponent);
      modalRef.componentInstance.toUser = newMessage.from;
    });

    this.chatConnection.on('NewPrivateMessage', (newMessage: Messages) => {
      this.privateMessages = [...this.messages, newMessage];
    });
    this.chatConnection.on('ClosePrivateChat', () => {
      this.privateMessageInitiated = false;
      this.privateMessages = [];
      this.modalService.dismissAll();
    });

  }

  stopConnection() {
    this.chatConnection?.stop().catch(error => {
      console.log(error);
    });
  }

  async addUserConnectionId() {
    this.chatConnection?.invoke('AddUserConnectionId', this.myName)
      .catch(error => console.log(error));
  }
  async sendMessage(content: string) {
    const message: Messages = {
      from: this.myName,
      content
    };
    return this.chatConnection?.invoke('ReceiveMessage', message)
      .catch(error => console.log(error));
  }
  async sendPrivateChatMessage(to: string, content: string) {
    const message: Messages = {
      from: this.myName,
      to,
      content
    };

    if (!this.privateMessageInitiated) {
      this.privateMessageInitiated = true;
      return this.chatConnection?.invoke('CreatePrivateChat', message).then(() => {
        this.privateMessages = [...this.privateMessages, message]
      })
        .catch(error => console.log(error));
    }
    else {
      return this.chatConnection?.invoke('ReceivePrivateMessage', message)
        .catch(error => console.log(error));
    }
  }

  async closePrivateChatMessage(otherUser: string) {
    this.chatConnection?.invoke('RemovePrivateChat', this.myName, otherUser)
      .catch(error => console.log(error));
  }

}
