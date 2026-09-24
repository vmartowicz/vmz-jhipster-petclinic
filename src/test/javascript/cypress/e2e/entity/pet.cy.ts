import {
  entityConfirmDeleteButtonSelector,
  entityCreateButtonSelector,
  entityCreateCancelButtonSelector,
  entityCreateSaveButtonSelector,
  entityDeleteButtonSelector,
  entityDetailsBackButtonSelector,
  entityDetailsButtonSelector,
  entityEditButtonSelector,
  entityTableSelector,
} from '../../support/entity';

describe('Pet e2e test', () => {
  const petPageUrl = '/pet';
  let username: string;
  let password: string;
  const petSample = { name: 'though er from' };

  let pet;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/pets+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/pets').as('postEntityRequest');
    cy.intercept('DELETE', '/api/pets/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (pet) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/pets/${pet.id}`,
      }).then(() => {
        pet = undefined;
      });
    }
  });

  it('Pets menu should load Pets page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('pet');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Pet').should('exist');
    cy.location('pathname').should('eq', petPageUrl);
  });

  describe('Pet page', () => {
    it('should have translated page title', () => {
      cy.visit(petPageUrl);
      cy.getEntityHeading('Pet').should('not.contain', 'jhpetclinicApp.pet.home.title');
    });

    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(petPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Pet page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.location('pathname').should('eq', `${petPageUrl}/new`);
        cy.getEntityCreateUpdateHeading('Pet');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.location('pathname').should('eq', petPageUrl);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/pets',
          body: petSample,
        }).then(({ body }) => {
          pet = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/pets+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/pets?page=0&size=20>; rel="last",<http://localhost/api/pets?page=0&size=20>; rel="first"',
              },
              body: [pet],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(petPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Pet page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('pet');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.location('pathname').should('eq', petPageUrl);
      });

      it('edit button click should load edit Pet page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Pet');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.location('pathname').should('eq', petPageUrl);
      });

      it('edit button click should load edit Pet page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Pet');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.location('pathname').should('eq', petPageUrl);
      });

      it('last delete button click should delete instance of Pet', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('pet').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.location('pathname').should('eq', petPageUrl);

        pet = undefined;
      });
    });
  });

  describe('new Pet page', () => {
    beforeEach(() => {
      cy.visit(petPageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Pet');
    });

    it('should create an instance of Pet', () => {
      cy.get(`[data-cy="name"]`).type('positively jealously measly');
      cy.get(`[data-cy="name"]`).should('have.value', 'positively jealously measly');

      cy.get(`[data-cy="birthDate"]`).type('2020-06-26');
      cy.get(`[data-cy="birthDate"]`).blur();
      cy.get(`[data-cy="birthDate"]`).should('have.value', '2020-06-26');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        pet = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.location('pathname').should('eq', petPageUrl);
    });
  });
});
