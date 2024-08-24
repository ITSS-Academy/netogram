import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe, NgClass, NgForOf } from '@angular/common';
import { Router } from '@angular/router';
import { PostModel } from '../../models/post.model';
import { IdToAvatarPipe } from '../../shared/pipes/id-to-avatar.pipe';
import { IdToNamePipe } from '../../shared/pipes/id-to-name.pipe';
import { MaterialModule } from '../../shared/material.module';
import { ProfileState } from '../../ngrx/profile/profile.state';
import { Store } from '@ngrx/store';
import * as ProfileActions from '../../ngrx/profile/profile.actions';
import * as PostActions from '../../ngrx/post/post.actions';

class PostResult {

}

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    MaterialModule,
    NgClass,

    NgForOf,
    IdToAvatarPipe,
    AsyncPipe,
    IdToNamePipe,
  ],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent {
  constructor(
    private router: Router,
    private store: Store<{
      profile: ProfileState;
    }>,
  ) {}

  @Input() postUser: PostModel = <PostModel>{};

  // postUser = [
  //   {
  //     avatar: 'https://www.w3schools.com/howto/img_avatar.png',
  //     name: 'John Doe',
  //     caption: 'Lorem ipsum dolor sit amet...',
  //     postTime: '3 days ago',
  //     postImages: [
  //       'https://images.unsplash.com/photo-1460353581641-37baddab0fa2',
  //       'https://images.unsplash.com/photo-1541698444083-023c97d3f4b6',
  //       'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
  //     ],
  //     likes: 856,
  //     comments: 23,
  //     shares: 12,
  //     isLiked: false,
  //   },
  //   {
  //     avatar: 'https://www.w3schools.com/howto/img_avatar.png',
  //     name: 'Jane Doe',
  //     caption: 'Another post caption...',
  //     postTime: '1 day ago',
  //     postImages: [
  //       'https://images.unsplash.com/photo-1460353581641-37baddab0fa2',
  //       'https://images.unsplash.com/photo-1541698444083-023c97d3f4b6',
  //       'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
  //     ],
  //     likes: 123,
  //     comments: 5,
  //     shares: 2,
  //     isLiked: false,
  //   },
  //   {
  //     avatar: 'https://www.w3schools.com/howto/img_avatar.png',
  //     name: 'Jane Doe',
  //     caption: 'Another post caption...',
  //     postTime: '1 day ago',
  //     postImages: [
  //       'https://images.unsplash.com/photo-1460353581641-37baddab0fa2',
  //       'https://images.unsplash.com/photo-1541698444083-023c97d3f4b6',
  //       'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
  //     ],
  //     likes: 123,
  //     comments: 5,
  //     shares: 2,
  //     isLiked: false,
  //   },
  // ];

  favoriteIcon = 'favorite_outlined';
  commentIcon = 'comment_outlined';
  shareIcon = 'ios_share_outlined';
  bookmarkIcon = 'bookmark_outlined';
  isDragging = false;
  startX = 0;
  scrollLeft = 0;

  toggleFavorite(post: any) {
    post.isLiked = !post.isLiked;
    post.likes += post.isLiked ? 1 : -1;
    this.favoriteIcon = post.isLiked ? 'favorite' : 'favorite_outlined';
  }

  toggleShare() {
    this.shareIcon =
      this.shareIcon === 'ios_share_outlined'
        ? 'ios_share'
        : 'ios_share_outlined';
  }

  toggleBookmark() {
    this.bookmarkIcon =
      this.bookmarkIcon === 'bookmark_outlined'
        ? 'bookmark'
        : 'bookmark_outlined';
  }

  prevImage(carousel: HTMLDivElement) {
    const imageWidth = carousel.querySelector('.post-image')?.clientWidth || 0;
    carousel.scrollBy({
      left: -(imageWidth + 10), // Adjust gap between images
      behavior: 'smooth',
    });
  }

  nextImage(carousel: HTMLDivElement) {
    const imageWidth = carousel.querySelector('.post-image')?.clientWidth || 0;
    carousel.scrollBy({
      left: imageWidth + 10, // Adjust gap between images
      behavior: 'smooth',
    });
  }

  onMouseDown(event: MouseEvent, carousel: HTMLDivElement) {
    event.preventDefault();
    this.isDragging = true;
    this.startX = event.pageX - carousel.offsetLeft;
    this.scrollLeft = carousel.scrollLeft;
  }

  onMouseLeave() {
    this.isDragging = false;
  }

  onMouseUp() {
    this.isDragging = false;
  }

  onMouseMove(event: MouseEvent, carousel: HTMLDivElement) {
    if (!this.isDragging) return;
    event.preventDefault();
    const x = event.pageX - carousel.offsetLeft;
    const walk = (x - this.startX) * 2;
    carousel.scrollLeft = this.scrollLeft - walk;
  }

  navigateToDetail(postIndex: number) {
    this.router.navigate(['/detail', postIndex]);
  }

  navigateToProfile() {
    this.router.navigateByUrl(`/profile/${this.postUser.uid}`).then();
    this.store.dispatch(PostActions.ClearMinePost());
    this.store.dispatch(ProfileActions.getById({ uid: this.postUser.uid }));
  }
}
