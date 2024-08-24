import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { MatCard, MatCardContent } from "@angular/material/card";
import { MatList, MatListItem } from "@angular/material/list";
import { MatButton, MatFabButton } from "@angular/material/button";
import { Location, NgForOf, NgIf } from "@angular/common";
import { PostComponent } from "../../components/post/post.component";
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { MatIcon } from "@angular/material/icon";

interface UserResult {
  uid: string;
  name: string;
  avatarUrl: string;
  mutualFriends: number;
}

interface PostResult {
  uid: string;
  userName: string;
  avatar: string;
  caption: string;
  postImages: string[];
  postTime: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
}

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
    NgIf,
    PostComponent,
    NavbarComponent,
    RouterOutlet,
    MatIcon,
    MatFabButton
  ],
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
  searchTerm: string = '';
  userResults: UserResult[] = [];
  postResults: PostResult[] = [];

  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      this.performSearch();
    });
  }

  performSearch() {
    this.userResults = this.getMockUserResults();
    this.postResults = this.getMockPostResults();
  }

  private getMockUserResults(): UserResult[] {
    return [
      { uid: '1', name: 'Shiba', avatarUrl: 'https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-1/434664048_1193158432056966_2412826848119332551_n.jpg?stp=dst-jpg_s200x200&_nc_cat=107&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeF7EOYQkcVsowEJxQD-XQH1XvPZcTrcxCNe89lxOtzEI-w1wgKBva9mchUgPV7FLE4Dq6Chb3joUjhOZy_RHRGk&_nc_ohc=Cvri7sjY7yIQ7kNvgFVOk9X&_nc_ht=scontent.fsgn5-10.fna&oh=00_AYCC0YvRxagL3_czneE_pOFXdj7q1QMeSb_1VC-iJPufUA&oe=66CC95F4', mutualFriends: 230 },
      { uid: '2', name: 'Akita', avatarUrl: 'https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-1/434664048_1193158432056966_2412826848119332551_n.jpg?stp=dst-jpg_s200x200&_nc_cat=107&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeF7EOYQkcVsowEJxQD-XQH1XvPZcTrcxCNe89lxOtzEI-w1wgKBva9mchUgPV7FLE4Dq6Chb3joUjhOZy_RHRGk&_nc_ohc=Cvri7sjY7yIQ7kNvgFVOk9X&_nc_ht=scontent.fsgn5-10.fna&oh=00_AYCC0YvRxagL3_czneE_pOFXdj7q1QMeSb_1VC-iJPufUA&oe=66CC95F4', mutualFriends: 180 },
      { uid: '3', name: 'Husky', avatarUrl: 'https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-1/434664048_1193158432056966_2412826848119332551_n.jpg?stp=dst-jpg_s200x200&_nc_cat=107&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeF7EOYQkcVsowEJxQD-XQH1XvPZcTrcxCNe89lxOtzEI-w1wgKBva9mchUgPV7FLE4Dq6Chb3joUjhOZy_RHRGk&_nc_ohc=Cvri7sjY7yIQ7kNvgFVOk9X&_nc_ht=scontent.fsgn5-10.fna&oh=00_AYCC0YvRxagL3_czneE_pOFXdj7q1QMeSb_1VC-iJPufUA&oe=66CC95F4', mutualFriends: 150 },
    ];
  }

  private getMockPostResults(): PostResult[] {
    return [
      {
        uid: '4',
        userName: 'Fried Dog',
        avatar: 'https://example.com/avatar4.jpg',
        caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
        postImages: ['https://example.com/post-image1.jpg', 'https://example.com/post-image2.jpg'],
        postTime: '3 days ago',
        likes: 30,
        comments: 30,
        shares: 30,
        isLiked: false
      },
      {
        uid: '5',
        userName: 'Cool Cat',
        avatar: 'https://example.com/avatar5.jpg',
        caption: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris',
        postImages: ['https://example.com/post-image3.jpg'],
        postTime: '1 day ago',
        likes: 45,
        comments: 20,
        shares: 15,
        isLiked: false
      },
    ];
  }

  goBack(): void {
    this.location.back();
  }
}
