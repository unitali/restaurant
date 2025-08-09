/// <reference types="cypress" />

const adminElements = {
    buttonCloseModal: '#button-close-modal-product-modal',
    buttonCancelRemoveModal: '#button-cancel',
    buttonConfirmRemoveModal: '#button-confirm',
    buttonRemoveProduct: '#button-remove-product',
    buttonRemoveCategory: '#delete-category-0',
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
    tabAdminProducts: '#admin-products-tab',
    tabCategories: '#admin-categories-tab',
    tableAdminCategories: '#admin-categories-table',
    tableAdminProducts: '#admin-products-table'
};

describe('AdminPage', () => {
    let skipBefore = false;

    before(() => {
        if (skipBefore) return;

        cy.visit('/login');
        cy.get(adminElements.inputEmail).type('admin@existente.com');
        cy.get(adminElements.inputPassword).type('123456', { log: false });
        cy.get(adminElements.buttonSubmit).click();
        cy.url().should('not.include', '/login');
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
        cy.visit('/login');
        cy.get(adminElements.inputEmail).type('admin@existente.com');
        cy.get(adminElements.inputPassword).type('123456', { log: false });
        cy.get(adminElements.buttonSubmit).click();
        cy.url().should('include', '/admin');
    });

    it('deve validar como primeiro acesso', () => {
        cy.get(adminElements.labelAdminPainelTitle).should('have.text', 'Painel Administrativo');
        cy.get(adminElements.labelAdminRestaurantName).should('have.text', 'Restaurante Novo');
        cy.get(adminElements.labelAdminRestaurantAddress).should('have.text', 'Endereço: Rua Nova, 456');
        cy.get(adminElements.labelAdminRestaurantPhone).should('have.text', 'Telefone: 11988888888');

        cy.get(adminElements.labelNoCategoryMessage).should('have.text', 'Nenhuma categoria encontrada. Cadastre uma categoria para começar a cadastrar produtos.');
        cy.get(adminElements.buttonNewProduct).should('not.exist');
        cy.get(adminElements.tableAdminProducts).should('not.exist');

        cy.get(adminElements.tabCategories).click();
        cy.get(adminElements.buttonNewCategory).should('have.text', 'Nova Categoria');
        cy.get(adminElements.labelCategoryModalTitle).should('not.exist');
        cy.get(adminElements.tableAdminCategories).should('not.exist');
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
        cy.get(adminElements.labelNoProductMessage).should('have.text', 'Nenhum produto encontrado.');

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
        cy.visit('/admin');
        cy.url().should('include', '/login');
    });
});