import { TestBed } from '@angular/core/testing';

import { NotificaçãoService } from './notificação.service';

describe('NotificaçãoService', () => {
  let service: NotificaçãoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificaçãoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
