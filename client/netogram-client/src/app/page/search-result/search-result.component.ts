import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatList, MatListItem } from '@angular/material/list';
import { MatButton, MatFabButton } from '@angular/material/button';
import { AsyncPipe, Location, NgForOf } from '@angular/common';
import { PostComponent } from '../../components/post/post.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { MatIcon } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { SearchState } from '../../ngrx/search/search.state';
import * as SearchActions from '../../ngrx/search/search.actions';
import { ProfileModel } from '../../models/profile.model';
import { PostModel } from '../../models/post.model';
import { IdToAvatarPipe } from '../../shared/pipes/id-to-avatar.pipe';
import { IdToNamePipe } from '../../shared/pipes/id-to-name.pipe';
import { ProfileState } from '../../ngrx/profile/profile.state';
import * as FriendshipActions from '../../ngrx/friend-ship/friendship.actions';
import { FriendshipModel } from '../../models/friendship.model';
import { getFriendshipStatus } from '../../ngrx/friend-ship/friendship.actions';
import { FriendshipState } from '../../ngrx/friend-ship/friendship.state';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatList,
    MatListItem,
    MatButton,
    NgForOf,
    PostComponent,
    NavbarComponent,
    RouterOutlet,
    MatIcon,
    MatFabButton,
    AsyncPipe,
    IdToAvatarPipe,
    IdToNamePipe,
  ],
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit, OnDestroy {
  searchTerm: string = '';

  friendRequestSentData: FriendshipModel = {
    id: 0,
    uid: '',
    friendUid: '',
    status: '',
  };

  isCreateSuccess$ = this.store.select('friendship', 'isCreateSuccess');
  searchResult$ = this.store.select('search', 'searchResult');
  subscription: Subscription[] = [];

  posts: PostModel[] = [];
  profiles: ProfileModel[] = [];
  status: any[] = [];
  mineUid!: string;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private store: Store<{
      search: SearchState;
      profile: ProfileState;
      friendship: FriendshipState;
    }>,
  ) {
    this.mineProfile$.subscribe((mineProfile) => {
      if (mineProfile) {
        this.mineUid = mineProfile.uid;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  getStatusSuccess$ = this.store.select(
    'friendship',
    'friendshipStatusSuccess',
  );
  friendshipStatus$ = this.store.select('friendship', 'friendshipStatus');
  mineProfile$ = this.store.select('profile', 'mine');

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['search'];
      if (this.searchTerm) {
        this.store.dispatch(SearchActions.search({ query: this.searchTerm }));
      }
    });

    this.subscription.push(
      this.searchResult$.subscribe((result) => {
        if (result.profiles != undefined && result.posts != undefined) {
          this.posts = result.posts;
          this.profiles = result.profiles;
          console.log('posts', this.posts);
          console.log('profile', this.profiles);
        }
      }),
    );

    for (let profile of this.profiles) {
      this.store.dispatch(getFriendshipStatus({ friendUid: profile.uid }));
      this.getStatusSuccess$.subscribe((success) => {
        if (success) {
          this.friendshipStatus$.subscribe((status) => {
            this.status.push(status);
          });
        }
      });
    }
    console.log('status', this.status);
  }

  addFriendSearch(friendUid: string) {
    this.mineProfile$.subscribe((mineProfile) => {
      if (mineProfile) {
        this.friendRequestSentData = {
          ...this.friendRequestSentData,
          friendUid: friendUid,
          uid: mineProfile.uid,
        };
      }
    });
    this.friendRequestSentData = { ...this.friendRequestSentData, friendUid };
    console.log(this.friendRequestSentData);
    this.store.dispatch(
      FriendshipActions.addFriend({
        friendShipModel: this.friendRequestSentData,
      }),
    );

    this.isCreateSuccess$.subscribe((isSuggestedFriendsLoaded) => {
      if (isSuggestedFriendsLoaded) {
        this.store.dispatch(getFriendshipStatus({ friendUid }));
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
