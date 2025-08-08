describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('deve exibir erro ao tentar logar com senha errada', () => {
    cy.get('#email').type('porpetone@gmail.com');
    cy.get('#password').type('senhaerrada', { log: false });
    cy.get('#submit').click();
    cy.contains("E-mail ou senha inválidos.").should('be.visible');
  });

  it('deve exibir erro ao tentar logar com usuario errado', () => {
    cy.get('#email').type('usuario@teste.com');
    cy.get('#password').type('202020', { log: false });
    cy.get('#submit').click();
    cy.contains("E-mail ou senha inválidos.").should('be.visible');
  });

  it('deve exibir erro ao tentar logar com email vazio', () => {
    cy.get('#email').clear();
    cy.get('#password').type('202020', { log: false });
    cy.get('#submit').click();
    cy.get('#error-email').should('be.visible').and('contain', 'Campo obrigatório');
  });

  it('deve exibir erro ao tentar logar com senha vazia', () => {
    cy.get('#email').type('porpetone@gmail.com');
    cy.get('#password').clear();
    cy.get('#submit').click();
    cy.get('#error-password').should('be.visible').and('contain', 'Campo obrigatório');
  });

  it('clicar no botão de mostrar senha', () => {
    cy.get('#email').type('porpetone@gmail.com');
    cy.get('#password').type('202020', { log: false });
    cy.get('#show-password').click();
    cy.get('#password').should('have.attr', 'type', 'text');
  });

  it('deve logar com sucesso com dados válidos', () => {
    cy.get('#email').type('porpetone@gmail.com');
    cy.get('#password').type('202020', { log: false });
    cy.get('#submit').click();
    cy.url().should('not.include', '/login');
    cy.contains("Login realizado com sucesso").should('be.visible');
  });
});