import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendCardSearchComponent } from './friend-card-search.component';

describe('FriendCardSearchComponent', () => {
  let component: FriendCardSearchComponent;
  let fixture: ComponentFixture<FriendCardSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FriendCardSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendCardSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
