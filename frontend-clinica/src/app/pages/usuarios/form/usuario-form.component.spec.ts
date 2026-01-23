import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioFormComponent } from './usuario-form.component';

describe('UsuarioForm', () => {
  let component: UsuarioFormComponent;
  let fixture: ComponentFixture<UsuarioFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
