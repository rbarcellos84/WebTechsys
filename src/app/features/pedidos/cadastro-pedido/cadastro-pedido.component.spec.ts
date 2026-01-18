import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroPedidoComponent } from './cadastro-pedido.component';

describe('CadastroPedidoComponent', () => {
  let component: CadastroPedidoComponent;
  let fixture: ComponentFixture<CadastroPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroPedidoComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CadastroPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
