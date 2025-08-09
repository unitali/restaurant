/// <reference types="cypress" />

const loginElements = {
  email: '#input-email',
  password: '#input-password',
  submit: '#button-submit',
  errorEmail: '#error-email',
  errorPassword: '#error-password',
  showPassword: '#show-password',
};

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('deve exibir erro ao tentar logar com senha errada', () => {
    cy.get(loginElements.email).type('porpetone@gmail.com');
    cy.get(loginElements.password).type('senhaerrada', { log: false });
    cy.get(loginElements.submit).click();
    cy.contains("E-mail ou senha inválidos.").should('be.visible');
  });

  it('deve exibir erro ao tentar logar com usuario errado', () => {
    cy.get(loginElements.email).type('usuario@teste.com');
    cy.get(loginElements.password).type('202020', { log: false });
    cy.get(loginElements.submit).click();
    cy.contains("E-mail ou senha inválidos.").should('be.visible');
  });

  it('deve exibir erro ao tentar logar com email vazio', () => {
    cy.get(loginElements.email).clear();
    cy.get(loginElements.password).type('202020', { log: false });
    cy.get(loginElements.submit).click();
    cy.get(loginElements.errorEmail).should('be.visible').and('contain', 'Campo obrigatório');
  });

  it('deve exibir erro ao tentar logar com senha vazia', () => {
    cy.get(loginElements.email).type('porpetone@gmail.com');
    cy.get(loginElements.password).clear();
    cy.get(loginElements.submit).click();
    cy.get(loginElements.errorPassword).should('be.visible').and('contain', 'Campo obrigatório');
  });

  it('clicar no botão de mostrar senha', () => {
    cy.get(loginElements.email).type('porpetone@gmail.com');
    cy.get(loginElements.password).type('202020', { log: false });
    cy.get(loginElements.showPassword).click();
    cy.get(loginElements.password).should('have.attr', 'type', 'text');
  });

  it('deve logar com sucesso com dados válidos', () => {
    cy.get(loginElements.email).type('porpetone@gmail.com');
    cy.get(loginElements.password).type('202020', { log: false });
    cy.get(loginElements.submit).click();
    cy.url().should('not.include', '/login');
    cy.contains("Login realizado com sucesso", { timeout: 10000 }).should('be.visible');
  });
});