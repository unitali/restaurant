/// <reference types="cypress" />

import { userCredentials, userSettings } from "../support/constants";

const elements = {
    restaurantName: '#input-restaurant-name',
    restaurantStreet: '#input-restaurant-address-street',
    restaurantNumber: "#input-restaurant-address-number",
    restaurantNeighborhood: "#input-restaurant-address-neighborhood",
    restaurantCity: "#input-restaurant-address-city",
    restaurantState: "#input-restaurant-address-state",
    restaurantZipcode: "#input-restaurant-address-zip-code",
    restaurantPhone: '#input-restaurant-phone',
    adminEmail: '#input-admin-email',
    adminPassword: '#input-admin-password',
    adminConfirmPassword: '#input-admin-confirm-password',
    createRestaurantButton: '#button-create-restaurant-button',
    toastAlert: '[role="alert"]',
};

describe('Página de Criação de Restaurante', () => {
    beforeEach(() => {
        cy.visit('/create-restaurant');
    });

    it("deve validar os campos obrigatorios", () => {
        cy.get(elements.restaurantName).should('have.attr', 'required');
        cy.get(elements.restaurantStreet).should('have.attr', 'required');
        cy.get(elements.restaurantNumber).should('have.attr', 'required');
        cy.get(elements.restaurantNeighborhood).should('have.attr', 'required');
        cy.get(elements.restaurantCity).should('have.attr', 'required');
        cy.get(elements.restaurantState).should('have.attr', 'required');
        cy.get(elements.restaurantZipcode).should('have.attr', 'required');
        cy.get(elements.restaurantPhone).should('have.attr', 'required');
        cy.get(elements.adminEmail).should('have.attr', 'required');
        cy.get(elements.adminPassword).should('have.attr', 'required');
        cy.get(elements.adminConfirmPassword).should('have.attr', 'required');
    });

    it("deve exibir erro se as senhas forem diferentes", () => {
        cy.get(elements.restaurantName).type(userSettings.companyName);
        cy.get(elements.restaurantStreet).type(userSettings.companyStreet);
        cy.get(elements.restaurantNumber).type(userSettings.companyNumber);
        cy.get(elements.restaurantNeighborhood).type(userSettings.companyNeighborhood);
        cy.get(elements.restaurantCity).type(userSettings.companyCity);
        cy.get(elements.restaurantState).type(userSettings.companyState);
        cy.get(elements.restaurantZipcode).type(userSettings.companyZipcode);
        cy.get(elements.restaurantPhone).type(userSettings.companyPhone);
        cy.get(elements.adminEmail).type(userCredentials.email);
        cy.get(elements.adminPassword).type(userCredentials.password);
        cy.get(elements.adminConfirmPassword).type(userCredentials.passwordDiferent);
        cy.get(elements.createRestaurantButton).should('have.attr', 'disabled');
    });

    it('deve criar restaurante e admin com sucesso', () => {
        cy.get(elements.restaurantName).type(userSettings.companyName);
        cy.get(elements.restaurantStreet).type(userSettings.companyStreet);
        cy.get(elements.restaurantNumber).type(userSettings.companyNumber);
        cy.get(elements.restaurantNeighborhood).type(userSettings.companyNeighborhood);
        cy.get(elements.restaurantCity).type(userSettings.companyCity);
        cy.get(elements.restaurantState).type(userSettings.companyState);
        cy.get(elements.restaurantZipcode).type(userSettings.companyZipcode);
        cy.get(elements.restaurantPhone).type(userSettings.companyPhone);
        cy.get(elements.adminEmail).type(userCredentials.email);
        cy.get(elements.adminPassword).type(userCredentials.password, { log: false });
        cy.get(elements.adminConfirmPassword).type(userCredentials.password, { log: false });
        cy.get(elements.createRestaurantButton).click();
        cy.get(elements.toastAlert).should('have.text', 'Restaurante e usuário criados com sucesso!');
        cy.wait(1600);
        cy.get(elements.toastAlert).should('not.exist');
    });

    it('deve exibir erro se o e-mail já estiver cadastrado', () => {
        cy.get(elements.restaurantName).type(userSettings.companyName);
        cy.get(elements.restaurantStreet).type(userSettings.companyStreet);
        cy.get(elements.restaurantNumber).type(userSettings.companyNumber);
        cy.get(elements.restaurantNeighborhood).type(userSettings.companyNeighborhood);
        cy.get(elements.restaurantCity).type(userSettings.companyCity);
        cy.get(elements.restaurantState).type(userSettings.companyState);
        cy.get(elements.restaurantZipcode).type(userSettings.companyZipcode);
        cy.get(elements.restaurantPhone).type(userSettings.companyPhone);
        cy.get(elements.adminEmail).type(userCredentials.email);
        cy.get(elements.adminPassword).type(userCredentials.password);
        cy.get(elements.adminConfirmPassword).type(userCredentials.password);
        cy.get(elements.createRestaurantButton).click();
        cy.get(elements.toastAlert).should('have.text', 'E-mail já cadastrado. Contate o suporte.');
        cy.wait(1600);
        cy.get(elements.toastAlert).should('not.exist');
    });

});