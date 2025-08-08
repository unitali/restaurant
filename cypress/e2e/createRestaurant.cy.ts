describe('Página de Criação de Restaurante', () => {
    beforeEach(() => {
        cy.visit('/create-restaurant');
    });

    it("deve validar os campos obrigatorios", () => {
        cy.get('#restaurant-name').should('have.attr', 'required');
        cy.get('#restaurant-address').should('have.attr', 'required');
        cy.get('#restaurant-phone').should('have.attr', 'required');
        cy.get('#admin-email').should('have.attr', 'required');
        cy.get('#admin-password').should('have.attr', 'required');
        cy.get('#admin-confirm-password').should('have.attr', 'required');
    });

    it("deve exibir erro se as senhas forem diferentes", () => {
        cy.get('#restaurant-name').type('Restaurante Teste');
        cy.get('#restaurant-address').type('Rua Teste, 123');
        cy.get('#restaurant-phone').type('11999999999');
        cy.get('#admin-email').type('admin@teste.com');
        cy.get('#admin-password').type('123456');
        cy.get('#admin-confirm-password').type('654321');
        cy.get('#create-restaurant-button').click();
        cy.contains("As senhas não coincidem").should('be.visible');
    });

    it('deve exibir erro se o e-mail já estiver cadastrado', () => {
        cy.get('#restaurant-name').type('Restaurante Teste');
        cy.get('#restaurant-address').type('Rua Teste, 123');
        cy.get('#restaurant-phone').type('11999999999');
        cy.get('#admin-email').type('admin@existente.com');
        cy.get('#admin-password').type('123456', { log: false });
        cy.get('#admin-confirm-password').type('123456', { log: false });
        cy.get('#create-restaurant-button').click();
        cy.contains("E-mail já cadastrado").should('be.visible');
    });

    it.skip('deve criar restaurante e admin com sucesso', () => {
        cy.get('#restaurant-name').type('Restaurante Novo');
        cy.get('#restaurant-address').type('Rua Nova, 456');
        cy.get('#restaurant-phone').type('11988888888');
        cy.get('#admin-email').type('admin@teste.com');
        cy.get('#admin-password').type('123456', { log: false });
        cy.get('#admin-confirm-password').type('123456', { log: false });
        cy.get('#create-restaurant-button').click();
        cy.contains("Restaurante e admin criados com sucesso", { timeout: 10000 }).should('be.visible');
    });
});