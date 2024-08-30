import { Component, OnInit } from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {MatButton, MatFabAnchor} from "@angular/material/button";
import {MaterialModule} from "../../shared/material.module";
import {Store} from "@ngrx/store";
import {FriendshipState} from "../../ngrx/friend-ship/friendship.state";
import * as FriendshipActions from "../../ngrx/friend-ship/friendship.actions";
import {ProfileState} from "../../ngrx/profile/profile.state";
import {IdToNamePipe} from "../../shared/pipes/id-to-name.pipe";
import {IdToAvatarPipe} from "../../shared/pipes/id-to-avatar.pipe";
import {FriendshipModel} from "../../models/friendship.model";
import {FriendShipModel} from "../../models/friend-ship.model";
import {getFriendshipStatus} from "../../ngrx/friend-ship/friendship.actions";
import {FriendCardComponent} from "./components/friend-card/friend-card.component";

@Component({
  selector: 'app-friend-suggestion',
  standalone: true,
  imports: [
    NgForOf,
    MatButton,
    MatFabAnchor,
    MaterialModule,
    AsyncPipe,
    IdToNamePipe,
    IdToAvatarPipe,
    FriendCardComponent
  ],
  templateUrl: './friend-suggestion.component.html',
  styleUrl: './friend-suggestion.component.scss'
})
export class FriendSuggestionComponent {



  suggetedFriends$ = this.store.select('friendship', 'suggestedFriends');
  mineProfile$ = this.store.select('profile', 'mine');


  constructor(private store: Store<{
  friendship: FriendshipState,
  profile: ProfileState}>) {
    this.mineProfile$.subscribe((mineProfile) => {
      if (mineProfile) {
        this.store.dispatch(FriendshipActions.getSuggestedFriends({uid: mineProfile.uid,page:1,limit:5} ));
      }
    })
    console.log(this.suggetedFriends$);
    }



  ngOnInit(): void {}
}
