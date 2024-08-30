import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { ProfileModel } from '../../../../models/profile.model';
import { StorageState } from '../../../../ngrx/storage/storage.state';
import { Store } from '@ngrx/store';
import { ProfileState } from '../../../../ngrx/profile/profile.state';
import { Subscription } from 'rxjs';
import * as StorageActions from '../../../../ngrx/storage/storage.actions';
import * as ProfileActions from '../../../../ngrx/profile/profile.actions';
import {
  MatSnackBar,
  MatSnackBarModule,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

interface FileInfo {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  previewUrl: string;
}

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatProgressSpinner,
  ],
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  subscription: Subscription[] = [];
  profileMine$ = this.store.select('profile', 'mine');
  storage$ = this.store.select('storage', 'url');
  storageCover$ = this.store.select('storage', 'urlCover');
  isUpdateSuccess$ = this.store.select('profile', 'isUpdateSuccess');
  isUpdateLoading$ = this.store.select('storage', 'isUploading');
  isUpdateFileError$ = this.store.select('storage', 'uploadError');
  profileMine: ProfileModel = <ProfileModel>{};
  submissionStatus: 'success' | 'error' | null = null;
  isUpdating$ = this.store.select('profile', 'isUpdating');

  isGettingMine$ = this.store.select('profile', 'isGettingById');

  storageUrl: string = '';
  storageCoverUrl: string = '';
  isUpdating = false;

  profileForm = new FormGroup({
    avatarPictureInfo: new FormControl<FileInfo | null>(null),
    coverPhotoInfo: new FormControl<FileInfo | null>(null),
    name: new FormControl(''),
    bio: new FormControl(''),
  });

  profileData: ProfileModel = {
    uid: '',
    userName: '',
    email: '',
    avatarUrl: '',
    bio: '',
    coverUrl: '',
  };

  constructor(
    private dialog: MatDialog,
    private store: Store<{
      storage: StorageState;
      profile: ProfileState;
    }>,
    public snackBar: MatSnackBar,
  ) {}

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
    this.store.dispatch(StorageActions.clearStorageState());
    this.store.dispatch(ProfileActions.clearUpdateState());
  }

  ngOnInit(): void {
    this.subscription.push(
      this.profileMine$.subscribe((profile) => {
        if (profile) {
          this.profileMine = profile;
          this.profileForm.patchValue({
            name: profile.userName,
            bio: profile.bio,
          });
        }
      }),
      this.profileMine$.subscribe((profile) => {
        if (profile) {
          this.profileMine = profile;
        }
      }),

      this.storage$.subscribe((url) => {
        if (url) {
          url.forEach((data) => {
            this.storageUrl = data;
          });
        }
      }),

      this.storageCover$.subscribe((url) => {
        if (url) {
          url.forEach((data) => {
            this.storageCoverUrl = data;
          });
        }
      }),

      this.isUpdateFileError$.subscribe((error) => {
        if (error.status) {
          this.submissionStatus = 'error';

          this.snackBar.open('image smaller 5MB', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['snackbar'],
          });
        }
      }),

      this.isUpdateSuccess$.subscribe((isSuccess) => {
        if (isSuccess) {
          this.isUpdating = false;

          this.store.dispatch(
            ProfileActions.getMine({ uid: this.profileMine.uid }),
          );

          this.store.dispatch(
            ProfileActions.getById({ uid: this.profileMine.uid }),
          );

          this.snackBar.open('Profile updated successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['snackbar'],
          });
          this.onClose();
        }
      }),
    );
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isUpdating = true;

      this.profileData = {
        uid: this.profileMine.uid,
        userName: this.profileForm.value.name || this.profileMine.userName,
        email: this.profileMine.email,
        avatarUrl: this.storageUrl || this.profileMine.avatarUrl,
        bio: this.profileForm.value.bio || this.profileMine.bio,
        coverUrl: this.storageCoverUrl || this.profileMine.coverUrl,
      };
      this.store.dispatch(
        ProfileActions.updateMine({ mine: this.profileData }),
      );
    } else {
      this.submissionStatus = 'error';
      // Reset invalid form controls to their old values
      Object.keys(this.profileForm.controls).forEach((key) => {
        const control = this.profileForm.get(key);
        if (control && control.invalid) {
          control.setValue(this.profileMine[key as keyof ProfileModel]);
        }
      });
    }
  }

  onClose() {
    this.dialog.closeAll();
  }

  changeAvatarPicture() {
    this.changeImage('avatarPictureInfo');
  }

  changeCoverPhoto() {
    this.changeImage('coverPhotoInfo');
  }

  private changeImage(controlName: 'avatarPictureInfo' | 'coverPhotoInfo') {
    if (controlName === 'avatarPictureInfo') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.size = 5;
      input.onchange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
          this.store.dispatch(
            StorageActions.uploadFile({
              file,
              fileName: `avatar/${this.profileMine.uid}`,
            }),
          );
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const fileInfo: FileInfo = {
              name: file.name,
              type: file.type,
              size: file.size,
              lastModified: file.lastModified,
              previewUrl: e.target.result,
            };
            this.profileForm.patchValue({ [controlName]: fileInfo });
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
          this.store.dispatch(
            StorageActions.uploadFileCover({
              file,
              fileName: `cover/${this.profileMine.uid}`,
            }),
          );
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const fileInfo: FileInfo = {
              name: file.name,
              type: file.type,
              size: file.size,
              lastModified: file.lastModified,
              previewUrl: e.target.result,
            };
            this.profileForm.patchValue({ [controlName]: fileInfo });
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  }
}
