/// <reference types="cypress" />

import { userCredentials, userSettings } from "../support/constants";

const loginUrl = "/login";
const adminUrl = "/admin";


const adminCompanySettingsTab = {
    labelCompanyName: '#label-company-name',
    labelCompanyAddress: '#label-company-address',
    labelCompanyPhone: '#label-company-phone',
    inputCompanyName: '#input-company-name',
    inputCompanyAddress: '#input-company-address',
    inputCompanyPhone: '#input-company-phone',
    buttonSaveSettings: '#button-save-settings',
    buttonEditSettings: '#button-edit-settings',
    buttonLinkMenu: '#button-link-menu',
    labelLinkMenu: '#label-link-menu',
    inputLinkMenu: '#input-link-menu',
    iconCopyLinkMenu: '#icon-link-menu'
};

const adminElements = {
    buttonCloseModal: '#button-close-modal-product-modal',
    buttonCancelRemoveModal: '#button-cancel',
    buttonConfirmRemoveModal: '#button-confirm',
    buttonRemoveProduct: '#product-delete-0',
    buttonRemoveCategory: '#category-delete-0',
    buttonNewCategory: '#button-new-category',
    buttonNewProduct: '#button-new-product',
    buttonSubmit: '#button-submit',
    buttonSubmitCategory: '#button-submit-category',
    buttonSubmitProduct: '#button-product-submit',
    inputCategoryDescription: '#input-category-description',
    inputCategoryName: '#input-category-name',
    inputEmail: '#input-email',
    inputPassword: '#input-password',
    inputProductDescription: '#input-product-description',
    inputProductName: '#input-product-name',
    inputProductPrice: '#input-product-price',
    labelAdminPainelTitle: '#admin-panel-title',
    labelAdminRestaurantAddress: '#admin-restaurant-address',
    labelAdminRestaurantName: '#admin-restaurant-name',
    labelAdminRestaurantPhone: '#admin-restaurant-phone',
    labelCategoryDescription: '#label-category-description',
    labelCategoryModalTitle: '#category-modal-title',
    labelCategoryName: '#label-category-name',
    labelNoCategoryMessage: '#no-category-message',
    labelNoProductMessage: '#no-products-message',
    labelProductDescription: '#label-product-description',
    labelProductName: '#label-product-name',
    labelProductPrice: '#label-product-price',
    tabProducts: '#admin-products-tab',
    tabCategories: '#admin-categories-tab',
    tabSettings: '#admin-settings-tab',
    tableAdminCategories: '#admin-categories-table',
    tableAdminProducts: '#admin-products-table'
};

describe('AdminPage', () => {
    let skipBefore = true;

    before(() => {
        if (skipBefore) return;

        cy.visit(loginUrl);
        cy.get(adminElements.inputEmail).type(userCredentials.email);
        cy.get(adminElements.inputPassword).type(userCredentials.password, { log: false });
        cy.get(adminElements.buttonSubmit).click();
        cy.url().should('not.include', loginUrl);
        cy.get(adminElements.tabCategories).click();
        cy.wait(2000);
        cy.get('body').then($body => {
            if ($body.find(adminElements.tableAdminCategories).length > 0) {
                cy.get(adminElements.tableAdminCategories
                ).then($table => {
                    const rowCount = $table.find('tr').length;
                    for (let i = 1; i < rowCount; i++) {
                        cy.get(adminElements.buttonRemoveCategory).click();
                        cy.get(adminElements.buttonConfirmRemoveModal).click();
                        cy.contains('Categoria removida com sucesso!', { timeout: 10000 }).should('be.visible');
                    }
                });
            }
        });
    });

    beforeEach(() => {
        cy.visit(adminUrl);
        cy.get(adminElements.inputEmail).type(userCredentials.email);
        cy.get(adminElements.inputPassword).type(userCredentials.password, { log: false });
        cy.get(adminElements.buttonSubmit).click();
        cy.url().should('include', adminUrl);
    });

    it('deve validar como primeiro acesso', () => {
        cy.get(adminElements.labelAdminPainelTitle).should('have.text', 'Painel Administrativo');

        cy.get(adminElements.tabProducts).click();
        cy.get(adminElements.labelNoCategoryMessage).should('have.text', 'Nenhuma categoria encontrada. Cadastre uma categoria para começar a cadastrar produtos.');
        cy.get(adminElements.buttonNewProduct).should('not.exist');
        cy.get(adminElements.tableAdminProducts).should('not.exist');

        cy.get(adminElements.tabCategories).click();
        cy.get(adminElements.buttonNewCategory).should('have.text', 'Nova Categoria');
        cy.get(adminElements.labelCategoryModalTitle).should('not.exist');
        cy.get(adminElements.tableAdminCategories).should('not.exist');

        cy.get(adminElements.tabSettings).click();
        cy.get(adminCompanySettingsTab.labelCompanyName).should('have.text', 'Nome Fantasia*');
        cy.get(adminCompanySettingsTab.inputCompanyName).should('have.attr', 'required');
        cy.get(adminCompanySettingsTab.inputCompanyName).should('have.value', userSettings.companyName);

        cy.get(adminCompanySettingsTab.labelCompanyAddress).should('have.text', 'Endereço*');
        cy.get(adminCompanySettingsTab.inputCompanyAddress).should('have.attr', 'required');
        cy.get(adminCompanySettingsTab.inputCompanyAddress).should('have.value', userSettings.companyAddress);

        cy.get(adminCompanySettingsTab.labelCompanyPhone).should('have.text', 'WhatsApp*');
        cy.get(adminCompanySettingsTab.inputCompanyPhone).should('have.attr', 'required');
        cy.get(adminCompanySettingsTab.inputCompanyPhone).should('have.value', userSettings.companyPhone);
        cy.get(adminCompanySettingsTab.buttonEditSettings).should('have.text', 'Editar');

        cy.get(adminCompanySettingsTab.labelLinkMenu).should('have.text', 'Link do Cardapio');
        cy.get(adminCompanySettingsTab.inputLinkMenu).should('exist');
        cy.get(adminCompanySettingsTab.iconCopyLinkMenu).should('exist');
    });

    it("deve criar uma categoria", () => {
        cy.get(adminElements.tabCategories).click();
        cy.get(adminElements.buttonNewCategory).click();

        cy.get(adminElements.labelCategoryModalTitle).should("have.text", "Criar Categoria");

        cy.get(adminElements.labelCategoryName).should("have.text", "Nome da Categoria*");
        cy.get(adminElements.inputCategoryName).should("have.attr", "required");
        cy.get(adminElements.inputCategoryName).type("Categoria Teste");

        cy.get(adminElements.labelCategoryDescription).should("have.text", "Descrição da Categoria");
        cy.get(adminElements.inputCategoryDescription).should("not.have.attr", "required");
        cy.get(adminElements.inputCategoryDescription).type("Descrição da Categoria");

        cy.get(adminElements.buttonSubmitCategory).should("have.text", "Criar Categoria");
        cy.get(adminElements.buttonSubmitCategory).click();
        cy.contains("Categoria cadastrada com sucesso!").should('be.visible');

    });

    it('deve criar um novo produto', () => {
        cy.get('table').should('not.exist');
        cy.get(adminElements.buttonNewProduct).should('have.text', 'Novo Produto');

        cy.get(adminElements.buttonNewProduct).click();
        cy.get(adminElements.labelProductName).should('have.text', 'Produto*');
        cy.get(adminElements.inputProductName).should('have.attr', 'required');
        cy.get(adminElements.inputProductName).type('Produto Teste');

        cy.get(adminElements.labelProductPrice).should('have.text', 'Preço*');
        cy.get(adminElements.inputProductPrice).should('have.attr', 'required');
        cy.get(adminElements.inputProductPrice).type('100');

        cy.get(adminElements.labelProductDescription).should('have.text', 'Descrição');
        cy.get(adminElements.inputProductDescription).should('not.have.attr', 'required');
        cy.get(adminElements.inputProductDescription).type('Descrição do Produto');

        cy.get(adminElements.buttonSubmitProduct).should('have.text', 'Criar Produto');
        cy.get(adminElements.buttonSubmitProduct).click();
        cy.contains('Produto cadastrado com sucesso!').should('be.visible');

        cy.get(adminElements.buttonCloseModal).click();
        cy.get(adminElements.tableAdminProducts).should('exist');

        cy.get("#product-image-0").should('exist');
        cy.get("#product-name-0").should('have.text', 'Produto Teste');
        cy.get("#product-price-0")
            .invoke('text')
            .then(text => {
                const normalized = text.replace(/\s+/g, ' ').trim();
                expect(normalized).to.eq('R$ 1,00');
            });
        cy.get("#product-description-0").should('have.text', 'Descrição do Produto');
        cy.get("#product-actions-0").should('exist');

    });

    it('deve redirecionar para login se não houver restaurantId', () => {
        localStorage.removeItem('restaurantId');
        cy.visit(loginUrl);
        cy.url().should('include', loginUrl);
        cy.url().should('not.include', adminUrl);
    });

    it('deve excluir um produto', () => {
        cy.get("#product-actions-0").within(() => {
            cy.get(adminElements.buttonRemoveProduct).click();
        });
        cy.get(adminElements.buttonConfirmRemoveModal).click();
        cy.contains("Produto excluído com sucesso!").should('be.visible');
    });

    it('deve excluir uma categoria', () => {
        cy.get(adminElements.tabCategories).click();

        cy.get("#category-actions-0").within(() => {
            cy.get(adminElements.buttonRemoveCategory).click();
        });
        cy.get(adminElements.buttonConfirmRemoveModal).click();
        cy.contains("Categoria removida com sucesso!").should('be.visible');
    });

});