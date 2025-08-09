/// <reference types="cypress" />

const elements = {
    restaurantName: '#input-restaurant-name',
    restaurantAddress: '#input-restaurant-address',
    restaurantPhone: '#input-restaurant-phone',
    adminEmail: '#input-admin-email',
    adminPassword: '#input-admin-password',
    adminConfirmPassword: '#input-admin-confirm-password',
    createRestaurantButton: '#button-create-restaurant-button',
};

describe('Página de Criação de Restaurante', () => {
    beforeEach(() => {
        cy.visit('/create-restaurant');
    });

    it("deve validar os campos obrigatorios", () => {
        cy.get(elements.restaurantName).should('have.attr', 'required');
        cy.get(elements.restaurantAddress).should('have.attr', 'required');
        cy.get(elements.restaurantPhone).should('have.attr', 'required');
        cy.get(elements.adminEmail).should('have.attr', 'required');
        cy.get(elements.adminPassword).should('have.attr', 'required');
        cy.get(elements.adminConfirmPassword).should('have.attr', 'required');
    });

    it("deve exibir erro se as senhas forem diferentes", () => {
        cy.get(elements.restaurantName).type('Restaurante Teste');
        cy.get(elements.restaurantAddress).type('Rua Teste, 123');
        cy.get(elements.restaurantPhone).type('11999999999');
        cy.get(elements.adminEmail).type('admin@teste.com');
        cy.get(elements.adminPassword).type('123456');
        cy.get(elements.adminConfirmPassword).type('654321');
        cy.get(elements.createRestaurantButton).click();
        cy.contains("As senhas não coincidem").should('be.visible');
    });

    it('deve exibir erro se o e-mail já estiver cadastrado', () => {
        cy.get(elements.restaurantName).type('Restaurante Teste');
        cy.get(elements.restaurantAddress).type('Rua Teste, 123');
        cy.get(elements.restaurantPhone).type('11999999999');
        cy.get(elements.adminEmail).type('admin@existente.com');
        cy.get(elements.adminPassword).type('123456', { log: false });
        cy.get(elements.adminConfirmPassword).type('123456', { log: false });
        cy.get(elements.createRestaurantButton).click();
        cy.contains("E-mail já cadastrado").should('be.visible');
    });

    it.skip('deve criar restaurante e admin com sucesso', () => {
        cy.get(elements.restaurantName).type('Restaurante Novo');
        cy.get(elements.restaurantAddress).type('Rua Nova, 456');
        cy.get(elements.restaurantPhone).type('11988888888');
        cy.get(elements.adminEmail).type('admin@existente.com');
        cy.get(elements.adminPassword).type('123456', { log: false });
        cy.get(elements.adminConfirmPassword).type('123456', { log: false });
        cy.get(elements.createRestaurantButton).click();
        cy.contains("Restaurante e admin criados com sucesso", { timeout: 10000 }).should('be.visible');
    });
});