import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { AsyncPipe, NgClass } from '@angular/common';
import { debounceTime, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ProfileState } from '../../ngrx/profile/profile.state';
import * as AuthActions from '../../ngrx/auth/auth.actions';
import * as ProfileActions from '../../ngrx/profile/profile.actions';
import { Subscription } from 'rxjs';
import { ProfileModel } from '../../models/profile.model';
import { AuthState } from '../../ngrx/auth/auth.state';
import { AuthService } from '../../services/auth/auth.service';
import { ShareModule } from '../../shared/share.module';
import { FormControl } from '@angular/forms';
import { SearchState } from '../../ngrx/search/search.state';
import * as SearchActions from '../../ngrx/search/search.actions';
import { MatDialog } from '@angular/material/dialog';
import * as PostActions from '../../ngrx/post/post.actions';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MaterialModule, NgClass, AsyncPipe, ShareModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  subscription: Subscription[] = [];

  logout$ = this.store.select('auth', 'logOutSuccess');

  profileMine$ = this.store.select('profile', 'mine');

  searchResult$ = this.store.select('search', 'searchResult');

  user = <ProfileModel>{};

  link = {
    label: 'Notifications',
    route: 'notifications',
    icon: 'home_app_logo',
  };

  activeLink = false;

  searchControl = new FormControl();

  searchResults: any;

  constructor(
    private route: Router,
    private dialog: MatDialog,
    private store: Store<{
      profile: ProfileState;
      auth: AuthState;
      search: SearchState;
    }>,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.route.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setActiveLinkBasedOnUrl();
      });

    this.setActiveLinkBasedOnUrl();

    this.subscription.push(
      this.logout$.subscribe((logout) => {
        if (logout == true) {
          this.route.navigate(['/login']).then();
        }
      }),

      this.searchControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe((query) => {
          this.store.dispatch(SearchActions.search({ query }));
        }),

      this.searchResult$.subscribe((searchResult) => {
        this.searchResults = searchResult;
      }),

      this.profileMine$.subscribe((profile) => {
        if (profile?.uid) {
          this.user = profile;
        }
      }),
    );
  }

  setActive(link: any) {
    this.route.navigateByUrl(link.route).then();
  }

  setActiveLinkBasedOnUrl() {
    this.activeLink = this.route.url.includes('/notifications');
  }

  logout() {
    this.authService.logout();
    this.store.dispatch(AuthActions.clearState());
    this.store.dispatch(ProfileActions.clearGetState());
  }

  onSearchKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      const query = this.searchControl.value;
      console.log('Close dialog');
      this.dialog.closeAll();
      if (query && query.trim() !== '') {
        this.route
          .navigate(['/search-result'], { queryParams: { search: query } })
          .then((r) => {});
      }
    }
  }

  navigateSearch() {
    this.route.navigateByUrl('/search-result').then();
  }

  handleImageError(event: any) {
    event.target.src = 'public/images/avatar.png';
  }

  navigateToHome() {
    this.route.navigateByUrl('/home').then(() => {
      this.store.dispatch(
        PostActions.GetAllPost({
          pageNumber: 1,
          limitNumber: 4,
        }),
      );
    });
  }
}
