import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreationsPage } from './creations.page';

describe('CreationsPage', () => {
  let component: CreationsPage;
  let fixture: ComponentFixture<CreationsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
