import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeleteDialogComponent } from './edit-delete-dialog.component';

describe('EditDeleteDialogComponent', () => {
  let component: EditDeleteDialogComponent;
  let fixture: ComponentFixture<EditDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDeleteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
