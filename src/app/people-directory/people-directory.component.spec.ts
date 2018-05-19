
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleDirectoryComponent } from './people-directory.component';

describe('PeopleDirectoryComponent', () => {
  let component: PeopleDirectoryComponent;
  let fixture: ComponentFixture<PeopleDirectoryComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleDirectoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
