import { ChangeDetectorRef, Component, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { jwt } from '../models/jwt';
import { User } from '../models/user';
declare var google: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  userForm: FormGroup = new FormGroup({});
  submitted = false;
  apiErrorMessages: string[] = [];
  openChat = false;
  user: User;


  constructor(private formBuilder: FormBuilder,
    private chatService: ChatService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone // Inject NgZone
  ) {
    this.user = { name: '' }; // Initialize the user property
  }


  ngOnInit(): void {
    console.log('google inititalization');
    google.accounts.id.initialize({
      client_id: '865577055178-srep1ea8n9j9udmemhqtkktk6mrnvrvu.apps.googleusercontent.com',
      //ux_mode: "redirect",
      callback: (response: any) => {
        this.ngZone.run(() => this.handleGoogleSignIn(response)); // Ensure callback runs within Angular's zone
      }
    });
    // google.accounts.id.renderButton(
    //   document.getElementById("buttonDiv"),
    //   { theme: "outline", size: "large" }  // customization attributes, shape: "rectangular",
    // );

    //google.accounts.id.prompt(); // also display the One Tap dialog
    this.initializeForm();
  }
  ngAfterViewInit() {
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: 'filled_blue',
        size: 'large',
        shape: 'rectangular',//'pill',
        text: 'signin_with',
        logo_alignment: 'left' }  // customization attributes, shape: "rectangular",
    );
  }
  handleGoogleSignIn = (response: any) => {
    console.log(response.credential);
    let base64Url = response.credential.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    console.log(JSON.parse(jsonPayload));
    this.register(JSON.parse(jsonPayload));

  }
  register(jwt: jwt) {
    if (jwt != null) {
      this.user.name = jwt.email.split('@')[0];
      this.chatService.registerUser(this.user).subscribe({
        next: () => {
          this.chatService.myName = this.user.name;
          this.openChat = true;
          // this.cdr.detectChanges();
          console.log("open chat : " + this.openChat)
          this.userForm.reset();
          this.submitted = false;
        },
        error: error => {
          if (typeof (error.error) != 'object') {
            this.apiErrorMessages.push(error.error)
          }
        }
      });
    }
  }


  initializeForm() {
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]]
    })
  }

  submitForm() {
    this.submitted = true;
    this.apiErrorMessages = [];
    if (this.userForm.valid) {
      this.chatService.registerUser(this.userForm.value).subscribe({
        next: () => {
          this.chatService.myName = this.userForm.get('name')?.value;
          this.openChat = true;
          this.userForm.reset();
          this.submitted = false;
        },
        error: error => {
          if (typeof (error.error) != 'object') {
            this.apiErrorMessages.push(error.error)
          }
        }
      });
    }
  }

  closeChat() {
    this.openChat = false;
    window.location.reload();
  }

  createFakeGoogleWrapper() {
    const googleLoginWrapper = document.createElement('div');
    //googleLoginWrapper.style.display = 'none';
    googleLoginWrapper.classList.add('g-signin2');
    document.body.appendChild(googleLoginWrapper);
    google.accounts.id.renderButton(googleLoginWrapper, { theme: "outline", size: "large" });
    googleLoginWrapper.click();
  }
}

/*The error you're encountering, Uncaught TypeError: this.register is not a function, occurs because this in the
 handleGoogleSignIn method doesn't refer to your Angular component instance (HomeComponent). 
 Instead, it refers to the global context (or possibly another context set by Google's callback mechanism).

To fix this, you should use an arrow function for the handleGoogleSignIn method to ensure that the context of this is correctly bound to
 the component instance.
Explanation
Arrow Function for Callback: Using an arrow function for the callback 
(callback: (response: any) => this.handleGoogleSignIn(response)) ensures that this retains the 
context of the component, so you can access component methods like register.
Arrow Function for handleGoogleSignIn: By defining handleGoogleSignIn as an arrow function, 
you make sure that it always has the correct this context when called.
*/



/*


If the UI components inside <app-chat> are not working correctly after Google Sign-In, there might be an issue with how Angular handles the context and lifecycle of components when third-party libraries (like Google's authentication library) are involved.

Here's what could be causing the issue:

Change Detection Not Triggering Properly: Similar to the previous issue, the Angular component may not be re-rendered correctly after the Google Sign-In process.
Google Callback and Angular Zones: When Google's sign-in callback is executed, it might not run within Angular's zone, meaning Angular doesn't know when to update the UI.
Solution: Ensure Proper Change Detection
You can use Angular's NgZone to ensure that the code runs within Angular's zone, thus properly triggering change detection.

Step-by-Step Fix
Import NgZone: Import NgZone from @angular/core.

typescript
Copy code
import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
Inject NgZone: Inject NgZone in your component's constructor.

typescript
Copy code
constructor(
    private formBuilder: FormBuilder,
    private chatService: ChatService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone // Inject NgZone
) {
    this.user = { name: '' }; // Initialize the user property
}
Wrap Google Callback in NgZone.run(): Modify the Google sign-in callback to ensure that it runs within Angular's zone.

typescript
Copy code
ngOnInit(): void {
    console.log('google initialization');
    google.accounts.id.initialize({
        client_id: '865577055178-srep1ea8n9j9udmemhqtkktk6mrnvrvu.apps.googleusercontent.com',
        callback: (response: any) => {
            this.ngZone.run(() => this.handleGoogleSignIn(response)); // Ensure callback runs within Angular's zone
        }
    });
    google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large" }
    );

    this.initializeForm();
}
Explanation
NgZone: Angular uses NgZone to automatically run code inside the Angular zone, which is necessary for triggering change detection. When the Google sign-in callback is invoked, it's likely outside of Angular's zone.
ngZone.run(): Wrapping the callback in ngZone.run() forces Angular to be aware of any changes that occur within the callback, thus ensuring that the UI updates as expected.
*/