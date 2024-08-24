<<<<<<< HEAD
import {
  Component,
  ElementRef,
  inject,
  ViewChild,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { MaterialModule } from '../../shared/material.module';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ProfileState } from '../../ngrx/profile/profile.state';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PostModel } from '../../models/post.model';
import { transition } from '@angular/animations';
import { PostState } from '../../ngrx/post/post.state';
import * as postActions from '../../ngrx/post/post.actions';
import { Subscription } from 'rxjs';
import { StorageState } from '../../ngrx/storage/storage.state';
import * as storageActions from '../../ngrx/storage/storage.actions';
import * as profileActions from '../../ngrx/profile/profile.actions';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent implements OnDestroy {
  startX = 0;
  scrollLeft = 0;

  subscription: Subscription[] = [];

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('postTextarea') postTextarea!: ElementRef;
  @ViewChild('imageContainer') imageContainer!: ElementRef;

  selectedFiles: File[] = [];
  public imageCount: number = 0;

  profileMine$ = this.store.select('profile', 'mine');
  readonly dialogRef = inject(MatDialogRef<DialogComponent>);

  postForm = new FormGroup({
    uid: new FormControl(''),
    imageUrl: new FormControl(''),
    content: new FormControl(''),
    id: new FormControl(''),
  });

  postData: PostModel = {
    uid: '',
    imageUrls: [],
    content: '',
    id: BigInt(0),
    createdAt: '',
  };

  constructor(
    private store: Store<{
      profile: ProfileState;
      post: PostState;
      storage: StorageState;
    }>,
  ) {
    this.subscription.push(
      this.profileMine$.subscribe((profile) => {
        if (profile) {
          console.log('profile', profile);
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngAfterViewInit() {
    const container = this.imageContainer.nativeElement;
    container.addEventListener('dragover', this.handleDragOver.bind(this));
    container.addEventListener('drop', this.handleDrop.bind(this));
  }

  initFileInput(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none'; // Hide the input element
    document.body.appendChild(input); // Append to the body or a specific container
    this.fileInput = new ElementRef(input); // Assign to ViewChild reference
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer!.dropEffect = 'copy';
  }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer!.files;
    this.processFiles(files);
  }

  addProfilePicture(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    if (this.imageCount < 5) {
      input.multiple = true;
    }
    input.onchange = (event: any) => {
      const files = event.target.files;
      if (this.imageCount + files.length > 5) {
        alert('You can only upload 5 images at a time');
        return;
      }
      this.selectedFiles = this.selectedFiles.concat(Array.from(files));
      this.processFiles(files);
    };
    input.click();
  }

  processFiles(files: FileList): void {
    const filesToProcess = Math.min(files.length, 5 - this.imageCount);
    console.log('Files selected:', files);
    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];
      if (file) {
        // this.store.dispatch(storageActions.uploadFile({file: file, fileName: 'posts'}));
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const imageSrc = e.target.result;
          this.insertImageIntoContainer(imageSrc);
          this.imageCount++;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  insertImageIntoContainer(imageSrc: string): void {
    const container = this.imageContainer.nativeElement;
    const containerWidth = container.clientWidth;
    const imgElement = document.createElement('div');
    imgElement.innerHTML = `<img style="height: 36vh; width: ${containerWidth}px; object-fit: scale-down" src="${imageSrc}" class="post-image" alt="Selected Image" />`;
    container.appendChild(imgElement);
  }

  delelteAllImages(): void {
    const container = this.imageContainer.nativeElement;
    container.innerHTML = '';
    this.imageCount = 0;
  }

  onFileSelected(event: any) {}

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

  onPost() {
    this.profileMine$.subscribe((profile) => {
      if (profile?.uid) {
        this.postData.uid = profile.uid;
      }
    });
    this.postData.content = <string>this.postForm.value.content;
    this.postData.imageUrls = [];
    this.postData.imageUrls = this.selectedFiles;
    console.log('Post Data', this.postData);
    this.store.dispatch(postActions.CreatePost({ post: this.postData }));
    this.dialogRef.close();
  }

  onMouseDown(event: MouseEvent, carousel: HTMLDivElement) {
    event.preventDefault();
    this.startX = event.pageX - carousel.offsetLeft;
    this.scrollLeft = carousel.scrollLeft;
  }
}
=======
import {
  Component,
  ElementRef,
  inject,
  ViewChild,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { MaterialModule } from '../../shared/material.module';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ProfileState } from '../../ngrx/profile/profile.state';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PostModel } from '../../models/post.model';
import { transition } from '@angular/animations';
import { PostState } from '../../ngrx/post/post.state';
import * as postActions from '../../ngrx/post/post.actions';
import { Subscription } from 'rxjs';
import { StorageState } from '../../ngrx/storage/storage.state';
import * as storageActions from '../../ngrx/storage/storage.actions';
import * as profileActions from '../../ngrx/profile/profile.actions';
import * as PostActions from '../../ngrx/post/post.actions';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent implements OnDestroy {
  startX = 0;
  scrollLeft = 0;

  subscription: Subscription[] = [];

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('postTextarea') postTextarea!: ElementRef;
  @ViewChild('imageContainer') imageContainer!: ElementRef;

  selectedFiles: File[] = [];
  public imageCount: number = 0;

  profileMine$ = this.store.select('profile', 'mine');
  readonly dialogRef = inject(MatDialogRef<DialogComponent>);

  isCreateSuccess$ = this.store.select('post', 'isCreateSuccess');

  postForm = new FormGroup({
    uid: new FormControl(''),
    imageUrl: new FormControl(''),
    content: new FormControl(''),
    id: new FormControl(''),
    createdAt: new FormControl(''),
  });

  postData: PostModel = {
    uid: '',
    imageUrls: [],
    content: '',
    id: BigInt(0),
    createdAt: '',
  };

  constructor(
    private store: Store<{
      profile: ProfileState;
      post: PostState;
      storage: StorageState;
    }>,
  ) {
    this.subscription.push(
      this.profileMine$.subscribe((profile) => {
        if (profile) {
          console.log('profile', profile);
        }
      }),

      this.isCreateSuccess$.subscribe((isCreateSuccess) => {
        if (isCreateSuccess) {
          this.store.dispatch(
            postActions.GetAllPost({ pageNumber: 1, limitNumber: 5 }),
          );
          this.dialogRef.close();
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngAfterViewInit() {
    const container = this.imageContainer.nativeElement;
    container.addEventListener('dragover', this.handleDragOver.bind(this));
    container.addEventListener('drop', this.handleDrop.bind(this));
  }

  initFileInput(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none'; // Hide the input element
    document.body.appendChild(input); // Append to the body or a specific container
    this.fileInput = new ElementRef(input); // Assign to ViewChild reference
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer!.dropEffect = 'copy';
  }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer!.files;
    this.processFiles(files);
  }

  addProfilePicture(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    if (this.imageCount < 5) {
      input.multiple = true;
    }
    input.onchange = (event: any) => {
      const files = event.target.files;
      if (this.imageCount + files.length > 5) {
        alert('You can only upload 5 images at a time');
        return;
      }
      this.selectedFiles = this.selectedFiles.concat(Array.from(files));
      this.processFiles(files);
    };
    input.click();
  }

  processFiles(files: FileList): void {
    const filesToProcess = Math.min(files.length, 5 - this.imageCount);
    console.log('Files selected:', files);
    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];
      if (file) {
        // this.store.dispatch(storageActions.uploadFile({file: file, fileName: 'posts'}));
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const imageSrc = e.target.result;
          this.insertImageIntoContainer(imageSrc);
          this.imageCount++;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  insertImageIntoContainer(imageSrc: string): void {
    const container = this.imageContainer.nativeElement;
    const containerWidth = container.clientWidth;
    const imgElement = document.createElement('div');
    imgElement.innerHTML = `<img style="height: 36vh; width: ${containerWidth}px; object-fit: scale-down" src="${imageSrc}" class="post-image" alt="Selected Image" />`;
    container.appendChild(imgElement);
  }

  delelteAllImages(): void {
    const container = this.imageContainer.nativeElement;
    container.innerHTML = '';
    this.imageCount = 0;
  }

  onFileSelected(event: any) {}

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

  onPost() {
    this.profileMine$.subscribe((profile) => {
      if (profile?.uid) {
        this.postData.uid = profile.uid;
      }
    });
    this.postData.content = <string>this.postForm.value.content;
    this.postData.imageUrls = [];
    this.postData.imageUrls = this.selectedFiles;
    console.log('Post Data', this.postData);
    this.store.dispatch(postActions.CreatePost({ post: this.postData }));
    this.dialogRef.close();
  }

  onMouseDown(event: MouseEvent, carousel: HTMLDivElement) {
    event.preventDefault();
    this.startX = event.pageX - carousel.offsetLeft;
    this.scrollLeft = carousel.scrollLeft;
  }
}
>>>>>>> 0f7914d8188938a1a165345ee5022a2ae8b68d7d
