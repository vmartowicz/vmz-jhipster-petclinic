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

describe('Owner e2e test', () => {
  const ownerPageUrl = '/owner';
  let username: string;
  let password: string;
  const ownerSample = {
    firstName: 'Fabian',
    lastName: 'Reichert',
    address: 'sans recent',
    city: 'Fort Dianaport',
    telephone: '239.835.2807 x395',
  };

  let owner;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/owners+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/owners').as('postEntityRequest');
    cy.intercept('DELETE', '/api/owners/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (owner) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/owners/${owner.id}`,
      }).then(() => {
        owner = undefined;
      });
    }
  });

  it('Owners menu should load Owners page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('owner');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Owner').should('exist');
    cy.location('pathname').should('eq', ownerPageUrl);
  });

  describe('Owner page', () => {
    it('should have translated page title', () => {
      cy.visit(ownerPageUrl);
      cy.getEntityHeading('Owner').should('not.contain', 'jhpetclinicApp.owner.home.title');
    });

    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(ownerPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Owner page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.location('pathname').should('eq', `${ownerPageUrl}/new`);
        cy.getEntityCreateUpdateHeading('Owner');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.location('pathname').should('eq', ownerPageUrl);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/owners',
          body: ownerSample,
        }).then(({ body }) => {
          owner = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/owners+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/owners?page=0&size=20>; rel="last",<http://localhost/api/owners?page=0&size=20>; rel="first"',
              },
              body: [owner],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(ownerPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Owner page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('owner');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.location('pathname').should('eq', ownerPageUrl);
      });

      it('edit button click should load edit Owner page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Owner');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.location('pathname').should('eq', ownerPageUrl);
      });

      it('edit button click should load edit Owner page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Owner');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.location('pathname').should('eq', ownerPageUrl);
      });

      it('last delete button click should delete instance of Owner', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('owner').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.location('pathname').should('eq', ownerPageUrl);

        owner = undefined;
      });
    });
  });

  describe('new Owner page', () => {
    beforeEach(() => {
      cy.visit(ownerPageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Owner');
    });

    it('should create an instance of Owner', () => {
      cy.get(`[data-cy="firstName"]`).type('Celia');
      cy.get(`[data-cy="firstName"]`).should('have.value', 'Celia');

      cy.get(`[data-cy="lastName"]`).type('Senger');
      cy.get(`[data-cy="lastName"]`).should('have.value', 'Senger');

      cy.get(`[data-cy="address"]`).type('before gadzooks blah');
      cy.get(`[data-cy="address"]`).should('have.value', 'before gadzooks blah');

      cy.get(`[data-cy="city"]`).type('Hansenboro');
      cy.get(`[data-cy="city"]`).should('have.value', 'Hansenboro');

      cy.get(`[data-cy="telephone"]`).type('(244) 428-2677 x6153');
      cy.get(`[data-cy="telephone"]`).should('have.value', '(244) 428-2677 x6153');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        owner = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.location('pathname').should('eq', ownerPageUrl);
    });
  });
});
