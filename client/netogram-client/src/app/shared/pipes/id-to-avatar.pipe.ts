import { Pipe, PipeTransform } from '@angular/core';
import { ProfileModel } from '../../models/profile.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ProfileService } from '../../services/profile/profile.service';
import * as url from 'node:url';

@Pipe({
  name: 'idToAvatar',
  standalone: true,
})
export class IdToAvatarPipe implements PipeTransform {
  constructor(private profileService: ProfileService) {}

  transform(uid: string): Observable<string> {
    console.log('uid:', uid);
    return this.profileService.getById(uid).pipe(
      map((profile: ProfileModel) => {
        const url = profile.avatarUrl;
        console.log('url:', url);
        return url;
      }),
    );
  }
}
