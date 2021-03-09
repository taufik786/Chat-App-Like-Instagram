import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import {io} from 'socket.io-client';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {
  postForm: FormGroup;
  socket: any;

  constructor(private fb: FormBuilder, private postService: PostService) {
    this.postForm = this.fb.group({
      post: ['', Validators.required]
    })

    this.socket = io('http://localhost:5000');
   }

  ngOnInit(): void {
  }

  submitPost(){
    this.postService.addPost(this.postForm.value).subscribe(data => {
      // console.log(data);
      this.socket.emit('refresh', {});

    })
    this.postForm.reset();

  }

}
