import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ProfileModel} from "../../../../models/profile.model";
import {IdToAvatarPipe} from "../../../../shared/pipes/id-to-avatar.pipe";
import {AsyncPipe} from "@angular/common";
import {IdToNamePipe} from "../../../../shared/pipes/id-to-name.pipe";
import {MatCardContent} from "@angular/material/card";
import {Store} from "@ngrx/store";
import {ProfileState} from "../../../../ngrx/profile/profile.state";
import {FriendshipState} from "../../../../ngrx/friend-ship/friendship.state";
import {MatButton} from "@angular/material/button";
import * as PostActions from "../../../../ngrx/post/post.actions";
import * as ProfileActions from "../../../../ngrx/profile/profile.actions";
import {Router} from "@angular/router";
import {ProfileSearchModel} from "../../../../models/profile-search.model";
import * as FriendshipActions from "../../../../ngrx/friend-ship/friendship.actions";
import {SearchState} from "../../../../ngrx/search/search.state";
import {FriendshipModel} from "../../../../models/friendship.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-friend-card-search',
  standalone: true,
  imports: [
    IdToAvatarPipe,
    AsyncPipe,
    IdToNamePipe,
    MatCardContent,
    MatButton,

  ],
  templateUrl: './friend-card-search.component.html',
  styleUrl: './friend-card-search.component.scss'
})
export class FriendCardSearchComponent implements OnInit, OnDestroy {
  private static isRequestInProgress = false;
  private static requestQueue: FriendCardSearchComponent[] = [];

  @Input() profile: any = {
    uid: "",
    email: "",
    userName: "",
    status: null
  }

  friendsipData: FriendshipModel = {
    uid: '',
    status: '',
    friendUid: '',
    id: 0
  }

  private subscriptions: Subscription[] = [];

  isGettingStatus$ = this.store.select('friendship', 'friendshipsIsLoading');
  isRemoved$ = this.store.select('friendship', 'isDeleteSuccess');
  isSentRequestSuccess$ = this.store.select('friendship', 'isCreateSuccess');
  isSearchSuccess$ = this.store.select('search', 'searchResult');
  friendshipStatus$ = this.store.select('friendship', 'friendshipStatus');
  isGetStatusSuccess$ = this.store.select('friendship', 'friendshipStatusSuccess');
  mineProfile = '';
  mineProfile$ = this.store.select('profile', 'mine');

  constructor(private router: Router,
              private store: Store<{
                profile: ProfileState,
                friendship: FriendshipState,
                search: SearchState
              }>) {
  }

  ngOnInit(): void {
    if (FriendCardSearchComponent.isRequestInProgress) {
      FriendCardSearchComponent.requestQueue.push(this);
    } else {
      this.getFriendshipStatus();
    }
  }

  private getFriendshipStatus(): void {
    FriendCardSearchComponent.isRequestInProgress = true;
    this.store.dispatch(FriendshipActions.getFriendshipStatus({friendUid: this.profile.uid}));

    const statusSub = this.isGetStatusSuccess$.subscribe((isGetStatusSuccess) => {
      if (isGetStatusSuccess) {
        const friendshipStatusSub = this.friendshipStatus$.subscribe((friendshipStatus) => {
          if (friendshipStatus) {
            this.profile = {...this.profile, status: friendshipStatus.status};
          }
          this.processQueue();
        });
        this.subscriptions.push(friendshipStatusSub);
      }
    });
    this.subscriptions.push(statusSub);
  }

  private processQueue(): void {
    FriendCardSearchComponent.isRequestInProgress = false;
    this.store.dispatch(FriendshipActions.clearFriendshipState());
    if (FriendCardSearchComponent.requestQueue.length > 0) {
      const nextInstance = FriendCardSearchComponent.requestQueue.shift();
      if (nextInstance) {
        nextInstance.getFriendshipStatus();
      }
    }
  }

  addFriendSearch( friendUid: string) {
    this.friendsipData = {...this.friendsipData,friendUid}
    this.store.dispatch(FriendshipActions.addFriend({friendShipModel: this.friendsipData}));

    const isSuggestedFriendsLoadedSub = this.isSentRequestSuccess$.subscribe((isSuggestedFriendsLoaded) => {
      if (isSuggestedFriendsLoaded){
        this.profile = {...this.profile, status: 'pending'};
      }
    });
    this.subscriptions.push(isSuggestedFriendsLoadedSub);
  }

  deleteRequest(friendUid: string) {
    const mineProfileSub = this.mineProfile$.subscribe((mineProfile) => {
      if (mineProfile) {
        this.friendsipData = {...this.friendsipData, friendUid: friendUid, uid: mineProfile.uid};
        this.store.dispatch(FriendshipActions.unfriend({uid: mineProfile.uid, friendUid: friendUid}));
      }
    });
    this.subscriptions.push(mineProfileSub);

    const isRemovedSub = this.isRemoved$.subscribe((isRemoved) => {
      if (isRemoved) {
        this.profile = {...this.profile, status: null};
      }
    });
    this.subscriptions.push(isRemovedSub);
    this.profile = {...this.profile, status: null};

    this.ngOnDestroy()
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  navigateToProfile() {
    this.router.navigateByUrl(`/profile/${this.profile.uid}`).then();
    this.store.dispatch(PostActions.ClearMinePost());
    this.store.dispatch(ProfileActions.getById({ uid: this.profile.uid }));
  }
}
