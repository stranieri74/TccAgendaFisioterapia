import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionarioFormComponent } from './funcionario-form.component';

describe('PacienteForm', () => {
  let component: FuncionarioFormComponent;
  let fixture: ComponentFixture<FuncionarioFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionarioFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FuncionarioFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
