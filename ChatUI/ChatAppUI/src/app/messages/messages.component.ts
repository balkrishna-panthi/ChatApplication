import { Component, Input } from '@angular/core';
import { Messages } from '../models/messages';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {
@Input() messages : Messages[]= [];
}
