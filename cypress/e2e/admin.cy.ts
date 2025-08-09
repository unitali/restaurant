describe('AdminPage', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.get('#email').type('admin@existente.com');
        cy.get('#password').type('123456', { log: false });
        cy.get('#submit').click();
        cy.url().should('not.include', '/login');
    });

    it('deve exibir o painel administrativo com dados do restaurante', () => {
        cy.get("#admin-panel-title").should('have.text', 'Painel Administrativo');
        cy.get("#admin-restaurant-name").should('have.text', 'Restaurante Novo');
        cy.get("#admin-restaurant-address").should('have.text', 'Endereço: Rua Nova, 456');
        cy.get("#admin-restaurant-phone").should('have.text', 'Telefone: 11988888888');
    });

    it('deve validar a nao existencia de campos na aba produto', () => {
        cy.get("#no-category-message").should('have.text', 'Nenhuma categoria encontrada. Cadastre uma categoria para começar a cadastrar produtos.');
        cy.get("#new-product-button").should('not.exist');
        cy.get("#search-category").should('not.exist');
        cy.get("#admin-products-table").should('not.exist');
    });

    it('deve validar a nao existencia de campos na aba categoria', () => {
        cy.get("#admin-categories-tab").click();
        cy.get("#new-category-button").should('have.text', 'Nova Categoria');
        cy.get("#search-category").should('not.exist');
        cy.get("#admin-categories-table").should('not.exist');
    });

    it.only("deve criar uma categoria", () => {
        cy.get("#admin-categories-tab").click();
        cy.get("#new-category-button").click();

        cy.get("#category-modal-title").should("have.text", "Criar Categoria");

        cy.get("#label-category-name").should("have.text", "Nome da Categoria*");
        cy.get("#category-name").should("have.attr", "required");
        cy.get("#category-name").type("Categoria Teste");

        cy.get("#label-category-description").should("have.text", "Descrição da Categoria");
        cy.get("#category-description").should("not.have.attr", "required");
        cy.get("#category-description").type("Descrição da Categoria");

        cy.get("#submit-category-button").should("have.text", "Criar Categoria");
        cy.get("#submit-category-button").click();
        cy.contains("Categoria cadastrada com sucesso!", { timeout: 10000 }).should('be.visible');

    });

    it('deve exibir a tabela de produtos ao abrir a aba Produtos', () => {
        cy.get("#admin-products-tab").click();
        cy.get('table').should('exist');
        cy.get('th').contains('Nome');
        cy.get('th').contains('Preço');
    });

    it('deve exibir a lista de categorias ao abrir a aba Categorias', () => {
        cy.contains('Categorias').click();
        cy.contains('Categorias').should('have.class', 'border-b-2');
        cy.get('ul').should('exist');
    });

    it('deve redirecionar para login se não houver restaurantId', () => {
        localStorage.removeItem('restaurantId');
        cy.visit('/admin');
        cy.url().should('include', '/login');
    });
});