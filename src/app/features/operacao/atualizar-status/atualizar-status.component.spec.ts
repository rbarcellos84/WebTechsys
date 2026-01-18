import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtualizarStatusComponent } from './atualizar-status.component';

describe('AtualizarStatusComponent', () => {
  let component: AtualizarStatusComponent;
  let fixture: ComponentFixture<AtualizarStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtualizarStatusComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AtualizarStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
