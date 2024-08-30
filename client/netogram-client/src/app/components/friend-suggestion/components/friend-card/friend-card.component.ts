import {Component, Input} from '@angular/core';
import {ProfileModel} from "../../../../models/profile.model";
import {Store} from "@ngrx/store";
import {ProfileState} from "../../../../ngrx/profile/profile.state";
import {FriendshipState} from "../../../../ngrx/friend-ship/friendship.state";
import * as FriendshipActions from "../../../../ngrx/friend-ship/friendship.actions";
import {AsyncPipe} from "@angular/common";
import {IdToAvatarPipe} from "../../../../shared/pipes/id-to-avatar.pipe";
import {IdToNamePipe} from "../../../../shared/pipes/id-to-name.pipe";
import {MatButton} from "@angular/material/button";
import {getFriendshipStatus} from "../../../../ngrx/friend-ship/friendship.actions";
import {FriendshipModel} from "../../../../models/friendship.model";
import {SuggestedFriend} from "../../../../models/suggested-friend";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-friend-card',
  standalone: true,
  imports: [
    AsyncPipe,
    IdToAvatarPipe,
    IdToNamePipe,
    MatButton
  ],
  templateUrl: './friend-card.component.html',
  styleUrl: './friend-card.component.scss'
})
export class FriendCardComponent {
  @Input() friend: SuggestedFriend = {
    suggestedFriend: "",
    mutualFriendsCount: 0,
    status: null
  };

  friendRequestSentData: FriendshipModel = {
    id: 0,
    uid: "",
    friendUid: "",
    status: ""
  };

  isRemoved$ = this.store.select('friendship', 'isDeleteSuccess');
  friendSatus$ = this.store.select('friendship', 'friendshipStatus');
  isSuggestedFriendsLoading$ = this.store.select('friendship', 'isCreating');
  isSuggestedFriendsLoaded$ = this.store.select('friendship', 'isCreateSuccess');
  mineProfile$ = this.store.select('profile', 'mine');

  private subscriptions: Subscription[] = [];

  constructor(private store: Store<{
    profile: ProfileState,
    friendship: FriendshipState
  }>) {
    this.store.dispatch(FriendshipActions.getFriendshipStatus({friendUid: this.friend.suggestedFriend}));
  }

  ngOnInit(): void {
    const friendStatusSub = this.friendSatus$.subscribe((friendSatus) => {
      if (friendSatus && friendSatus.friendUid === this.friend.suggestedFriend){
        this.friend = {...this.friend, status: friendSatus.status};
      }
    });
    this.subscriptions.push(friendStatusSub);
  }

  addFriend(friendUid: string){
    const mineProfileSub = this.mineProfile$.subscribe((mineProfile) => {
      if (mineProfile) {
        this.friendRequestSentData = {...this.friendRequestSentData, friendUid: friendUid, uid: mineProfile.uid};
      }
    });
    this.subscriptions.push(mineProfileSub);

    this.friendRequestSentData = {...this.friendRequestSentData, friendUid};
    this.store.dispatch(FriendshipActions.addFriend({friendShipModel: this.friendRequestSentData}));

    const isSuggestedFriendsLoadedSub = this.isSuggestedFriendsLoaded$.subscribe((isSuggestedFriendsLoaded) => {
      if (isSuggestedFriendsLoaded){
        this.friend = {...this.friend, status: 'pending'};
      }
    });
    this.subscriptions.push(isSuggestedFriendsLoadedSub);
  }

  removeRequest(friendUid: string){
    const mineProfileSub = this.mineProfile$.subscribe((mineProfile) => {
      if (mineProfile) {
        this.friendRequestSentData = {...this.friendRequestSentData, friendUid: friendUid, uid: mineProfile.uid};
        this.store.dispatch(FriendshipActions.unfriend({uid: mineProfile.uid, friendUid: friendUid}));
      }
    });
    this.subscriptions.push(mineProfileSub);

    const isRemovedSub = this.isRemoved$.subscribe((isRemoved) => {
      if (isRemoved) {
        this.friend = {...this.friend, status: null};
      }
    });
    this.subscriptions.push(isRemovedSub);
    this.friend = {...this.friend, status: null};

    this.ngOnDestroy()
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
