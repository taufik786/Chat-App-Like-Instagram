import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { PostService } from 'src/app/services/post.service';
import {io} from 'socket.io-client';
import _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts = [];
  socket: any;
  user: any;

  constructor(private postService: PostService, private tokenService: TokenService,
  private router: Router) {
    this.socket = io('http://localhost:5000');
  }

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();
    this.AllPosts();

    this.socket.on('refreshPage', (data)=>{
      this.AllPosts();
    })

  }
  AllPosts(){
    this.postService.getAllPosts().subscribe(data => {
      // console.log(data);
      this.posts = data.posts;

    }, err => {
      if(err.error.token === null) {
        this.tokenService.DeleteToken();
        this.router.navigate(['']);
      }
    })
  }
  LikePost(post){
    // console.log(post);
    this.postService.addLike(post).subscribe(data => {
      // console.log(data);
      this.socket.emit('refresh', {})

    }, err => console.log(err) );

  }

  CheeckInLikeArray(arr, username){
    return _.some(arr, {username: username});
  }

  TimeFromNow(time){
    return moment(time).fromNow();
  }

  openCommentBox(post){
    this.router.navigate(['post', post._id])
  }
}