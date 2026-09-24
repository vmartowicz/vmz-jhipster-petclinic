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

describe('Vet e2e test', () => {
  const vetPageUrl = '/vet';
  let username: string;
  let password: string;
  const vetSample = { firstName: 'Reyes', lastName: 'Goodwin' };

  let vet;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/vets+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/vets').as('postEntityRequest');
    cy.intercept('DELETE', '/api/vets/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (vet) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/vets/${vet.id}`,
      }).then(() => {
        vet = undefined;
      });
    }
  });

  it('Vets menu should load Vets page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('vet');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Vet').should('exist');
    cy.location('pathname').should('eq', vetPageUrl);
  });

  describe('Vet page', () => {
    it('should have translated page title', () => {
      cy.visit(vetPageUrl);
      cy.getEntityHeading('Vet').should('not.contain', 'jhpetclinicApp.vet.home.title');
    });

    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(vetPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Vet page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.location('pathname').should('eq', `${vetPageUrl}/new`);
        cy.getEntityCreateUpdateHeading('Vet');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.location('pathname').should('eq', vetPageUrl);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/vets',
          body: vetSample,
        }).then(({ body }) => {
          vet = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/vets+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/vets?page=0&size=20>; rel="last",<http://localhost/api/vets?page=0&size=20>; rel="first"',
              },
              body: [vet],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(vetPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Vet page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('vet');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.location('pathname').should('eq', vetPageUrl);
      });

      it('edit button click should load edit Vet page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Vet');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.location('pathname').should('eq', vetPageUrl);
      });

      it('edit button click should load edit Vet page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Vet');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.location('pathname').should('eq', vetPageUrl);
      });

      it('last delete button click should delete instance of Vet', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('vet').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.location('pathname').should('eq', vetPageUrl);

        vet = undefined;
      });
    });
  });

  describe('new Vet page', () => {
    beforeEach(() => {
      cy.visit(vetPageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Vet');
    });

    it('should create an instance of Vet', () => {
      cy.get(`[data-cy="firstName"]`).type('Gustave');
      cy.get(`[data-cy="firstName"]`).should('have.value', 'Gustave');

      cy.get(`[data-cy="lastName"]`).type('Luettgen');
      cy.get(`[data-cy="lastName"]`).should('have.value', 'Luettgen');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        vet = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.location('pathname').should('eq', vetPageUrl);
    });
  });
});
