import {
  Component,
  inject,
  model,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { MaterialModule } from '../../../../shared/material.module';
import { PostComponent } from '../../../../components/post/post.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../../components/dialog/dialog.component';
import * as PostActions from '../../../../ngrx/post/post.actions';
import { Store } from '@ngrx/store';
import { PostState } from '../../../../ngrx/post/post.state';
import { ProfileState } from '../../../../ngrx/profile/profile.state';
import { Subscription } from 'rxjs';
import { PostModel, PostResponse } from '../../../../models/post.model';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule, PostComponent, InfiniteScrollDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store<{
      post: PostState;
      profile: ProfileState;
    }>,
  ) {
    this.store.dispatch(
      PostActions.GetAllPost({
        pageNumber: this.currentPage,
        limitNumber: this.size,
      }),
    );
  }

  allPosts$ = this.store.select('post', 'posts');
  profilePic = 'https://www.w3schools.com/howto/img_avatar.png';
  readonly port = signal('');
  readonly name = model('');
  readonly dialog = inject(MatDialog);

  subscription: Subscription[] = [];

  currentPage = 1;
  size = 5;
  itemsCount = 0;
  tempArray: PostModel[] = [];

  allPosts: PostModel[] = [];

  ngOnInit(): void {
    this.subscription.push(
      this.allPosts$.subscribe((posts) => {
        if (posts.limitNumber > 0) {
          this.tempArray = [...this.allPosts];
          this.allPosts = [...this.tempArray, ...posts.data];
          console.log(posts);
          this.itemsCount = posts.limitNumber;
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
    this.store.dispatch(PostActions.ClearAllPosts());
  }

  openDialog(): void {
    // this.dialog.open(DialogOverviewExampleDialog);

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '70vw',
      height: '78vh',
      panelClass: 'custom-dialog-container',
      // data: {name: this.name(), port: this.port()},
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   if (result !== undefined) {
    //     this.port.set(result);
    //   }
    // });
  }

  onScrollDown(ev: any) {
    console.log('scrolled down!!', ev);
    this.currentPage += 1;
    console.log(this.currentPage);

    if (this.currentPage <= this.itemsCount) {
      console.log('get more post');
      this.store.dispatch(
        PostActions.GetAllPost({
          pageNumber: this.currentPage,
          limitNumber: this.size,
        }),
      );
    }
  }
}
