/// <reference types="cypress" />

import { userCredentials, userSettings } from "../support/constants";

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
        cy.get(elements.restaurantName).type(userSettings.companyName);
        cy.get(elements.restaurantAddress).type(userSettings.companyAddress);
        cy.get(elements.restaurantPhone).type(userSettings.companyPhone);
        cy.get(elements.adminEmail).type(userCredentials.email);
        cy.get(elements.adminPassword).type(userCredentials.password);
        cy.get(elements.adminConfirmPassword).type(userCredentials.passwordDiferent);
        cy.get(elements.createRestaurantButton).click();
        cy.contains("As senhas não coincidem").should('be.visible');
    });

    it('deve criar restaurante e admin com sucesso', () => {
        cy.get(elements.restaurantName).type(userSettings.companyName);
        cy.get(elements.restaurantAddress).type(userSettings.companyAddress);
        cy.get(elements.restaurantPhone).type(userSettings.companyPhone);
        cy.get(elements.adminEmail).type(userCredentials.email);
        cy.get(elements.adminPassword).type(userCredentials.password, { log: false });
        cy.get(elements.adminConfirmPassword).type(userCredentials.password, { log: false });
        cy.get(elements.createRestaurantButton).click();
        cy.contains("Restaurante e usuário criados com sucesso!", { timeout: 10000 }).should('be.visible');
    });

    it('deve exibir erro se o e-mail já estiver cadastrado', () => {
        cy.get(elements.restaurantName).type(userSettings.companyName);
        cy.get(elements.restaurantAddress).type(userSettings.companyAddress);
        cy.get(elements.restaurantPhone).type(userSettings.companyPhone);
        cy.get(elements.adminEmail).type(userCredentials.email);
        cy.get(elements.adminPassword).type(userCredentials.password);
        cy.get(elements.adminConfirmPassword).type(userCredentials.password);
        cy.get(elements.createRestaurantButton).click();
        cy.contains("E-mail já cadastrado").should('be.visible');
    });
});