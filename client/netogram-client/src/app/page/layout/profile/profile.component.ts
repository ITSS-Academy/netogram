import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet, Scroll } from '@angular/router';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { MaterialModule } from '../../../shared/material.module';
import { AsyncPipe, Location } from '@angular/common';
import { PostComponent } from '../../../components/post/post.component';
import { MatDialog } from '@angular/material/dialog';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { Store } from '@ngrx/store';
import { PostState } from '../../../ngrx/post/post.state';
import { ProfileState } from '../../../ngrx/profile/profile.state';
import * as ProfileActions from '../../../ngrx/profile/profile.actions';
import * as PostActions from '../../../ngrx/post/post.actions';
import { Subscription } from 'rxjs';
import { PostResponse } from '../../../models/post.model';
import { ProfileModel } from '../../../models/profile.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    MaterialModule,
    PostComponent,
    AsyncPipe,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
  constructor(
    private location: Location,
    private activeRoute: ActivatedRoute,
    private dialog: MatDialog,
    private store: Store<{
      post: PostState;
      profile: ProfileState;
    }>,
  ) {
    const { uid } = this.activeRoute.snapshot.params;
    this.yourUid = uid;
    this.store.dispatch(ProfileActions.getById({ uid }));
    this.store.dispatch(
      PostActions.GetMinePost({ uid, pageNumber: 1, limitNumber: 5 }),
    );

    // window.scrollTo({ top: window.innerHeight * 0.3, behavior: 'auto'});
  }

  mineUid = '';
  yourUid = '';

  subscriptions: Subscription[] = [];

  profileByUid$ = this.store.select('profile', 'profile');
  minePosts$ = this.store.select('post', 'minePosts');
  isGettingMinePost$ = this.store.select('post', 'isGettingMinePost');
  isGettingMine$ = this.store.select('profile', 'isGettingById');
  mineProfile$ = this.store.select('profile', 'mine');
  minePosts: PostResponse = <PostResponse>{};
  mineProfile: ProfileModel = <ProfileModel>{};

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.store.dispatch(PostActions.ClearMinePost());
  }

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.profileByUid$.subscribe((profile) => {
        if (profile) {
          this.mineProfile = profile;
        }
      }),

      this.minePosts$.subscribe((posts) => {
        console.log(posts);
        this.minePosts = posts;
      }),

      this.isGettingMine$.subscribe((isGettingMine) => {
        console.log(isGettingMine);
      }),

      this.mineProfile$.subscribe((mineProfile) => {
        if (mineProfile) {
          this.mineUid = mineProfile.uid;
        }
      }),
    );
  }

  profileEdit(): void {
    const dialogRef = this.dialog.open(ProfileEditComponent, {
      width: '100px',
    });
  }
}
