package fr.vmz.jhipster.petclinic.web.rest;

import static fr.vmz.jhipster.petclinic.domain.VisitAsserts.*;
import static fr.vmz.jhipster.petclinic.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.vmz.jhipster.petclinic.IntegrationTest;
import fr.vmz.jhipster.petclinic.domain.Pet;
import fr.vmz.jhipster.petclinic.domain.Visit;
import fr.vmz.jhipster.petclinic.repository.VisitRepository;
import fr.vmz.jhipster.petclinic.service.VisitService;
import fr.vmz.jhipster.petclinic.service.dto.VisitDTO;
import fr.vmz.jhipster.petclinic.service.mapper.VisitMapper;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link VisitResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class VisitResourceIT {

    private static final LocalDate DEFAULT_VISIT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_VISIT_DATE = LocalDate.now(ZoneId.systemDefault());
    private static final LocalDate SMALLER_VISIT_DATE = LocalDate.ofEpochDay(-1L);

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/visits";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private VisitRepository visitRepository;

    @Mock
    private VisitRepository visitRepositoryMock;

    @Autowired
    private VisitMapper visitMapper;

    @Mock
    private VisitService visitServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVisitMockMvc;

    private Visit visit;

    private Visit insertedVisit;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Visit createEntity() {
        return new Visit().visitDate(DEFAULT_VISIT_DATE).description(DEFAULT_DESCRIPTION);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Visit createUpdatedEntity() {
        return new Visit().visitDate(UPDATED_VISIT_DATE).description(UPDATED_DESCRIPTION);
    }

    @BeforeEach
    void initTest() {
        visit = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedVisit != null) {
            visitRepository.delete(insertedVisit);
            insertedVisit = null;
        }
    }

    @Test
    @Transactional
    void createVisit() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Visit
        VisitDTO visitDTO = visitMapper.toDto(visit);
        var returnedVisitDTO = om.readValue(
            restVisitMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(visitDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            VisitDTO.class
        );

        // Validate the Visit in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedVisit = visitMapper.toEntity(returnedVisitDTO);
        assertVisitUpdatableFieldsEquals(returnedVisit, getPersistedVisit(returnedVisit));

        insertedVisit = returnedVisit;
    }

    @Test
    @Transactional
    void createVisitWithExistingId() throws Exception {
        // Create the Visit with an existing ID
        visit.setId(1L);
        VisitDTO visitDTO = visitMapper.toDto(visit);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVisitMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(visitDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Visit in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        visit.setDescription(null);

        // Create the Visit, which fails.
        VisitDTO visitDTO = visitMapper.toDto(visit);

        restVisitMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(visitDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllVisits() throws Exception {
        // Initialize the database
        insertedVisit = visitRepository.saveAndFlush(visit);

        // Get all the visitList
        restVisitMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(visit.getId().intValue())))
            .andExpect(jsonPath("$.[*].visitDate").value(hasItem(DEFAULT_VISIT_DATE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllVisitsWithEagerRelationshipsIsEnabled() throws Exception {
        when(visitServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restVisitMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(visitServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllVisitsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(visitServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restVisitMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(visitRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getVisit() throws Exception {
        // Initialize the database
        insertedVisit = visitRepository.saveAndFlush(visit);

        // Get the visit
        restVisitMockMvc
            .perform(get(ENTITY_API_URL_ID, visit.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(visit.getId().intValue()))
            .andExpect(jsonPath("$.visitDate").value(DEFAULT_VISIT_DATE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getVisitsByIdFiltering() throws Exception {
        // Initialize the database
        insertedVisit = visitRepository.saveAndFlush(visit);

        Long id = visit.getId();

        defaultVisitFiltering("id.equals=" + id, "id.notEquals=" + id);

        defaultVisitFiltering("id.greaterThanOrEqual=" + id, "id.greaterThan=" + id);

        defaultVisitFiltering("id.lessThanOrEqual=" + id, "id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllVisitsByVisitDateIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedVisit = visitRepository.saveAndFlush(visit);

        // Get all the visitList where visitDate equals to
        defaultVisitFiltering("visitDate.equals=" + DEFAULT_VISIT_DATE, "visitDate.equals=" + UPDATED_VISIT_DATE);
    }

    @Test
    @Transactional
    void getAllVisitsByVisitDateIsInShouldWork() throws Exception {
        // Initialize the database
        insertedVisit = visitRepository.saveAndFlush(visit);

        // Get all the visitList where visitDate in
        defaultVisitFiltering("visitDate.in=" + DEFAULT_VISIT_DATE + "," + UPDATED_VISIT_DATE, "visitDate.in=" + UPDATED_VISIT_DATE);
    }

    @Test
    @Transactional
    void getAllVisitsByVisitDateIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedVisit = visitRepository.saveAndFlush(visit);

        // Get all the visitList where visitDate is not null
        defaultVisitFiltering("visitDate.specified=true", "visitDate.specified=false");
    }

    @Test
    @Transactional
    void getAllVisitsByVisitDateIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedVisit = visitRepository.saveAndFlush(visit);

        // Get all the visitList where visitDate is greater than or equal to
        defaultVisitFiltering("visitDate.greaterThanOrEqual=" + DEFAULT_VISIT_DATE, "visitDate.greaterThanOrEqual=" + UPDATED_VISIT_DATE);
    }

    @Test
    @Transactional
    void getAllVisitsByVisitDateIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedVisit = visitRepository.saveAndFlush(visit);

        // Get all the visitList where visitDate is less than or equal to
        defaultVisitFiltering("visitDate.lessThanOrEqual=" + DEFAULT_VISIT_DATE, "visitDate.lessThanOrEqual=" + SMALLER_VISIT_DATE);
    }

    @Test
    @Transactional
    void getAllVisitsByVisitDateIsLessThanSomething() throws Exception {
        // Initialize the database
        insertedVisit = visitRepository.saveAndFlush(visit);

        // Get all the visitList where visitDate is less than
        defaultVisitFiltering("visitDate.lessThan=" + UPDATED_VISIT_DATE, "visitDate.lessThan=" + DEFAULT_VISIT_DATE);
    }

    @Test
    @Transactional
    void getAllVisitsByVisitDateIsGreaterThanSomething() throws Exception {
        // Initialize the database
        insertedVisit = visitRepository.saveAndFlush(visit);

        // Get all the visitList where visitDate is greater than
        defaultVisitFiltering("visitDate.greaterThan=" + SMALLER_VISIT_DATE, "visitDate.greaterThan=" + DEFAULT_VISIT_DATE);
    }

    @Test
    @Transactional
    void getAllVisitsByDescriptionIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedVisit = visitRepository.saveAndFlush(visit);

        // Get all the visitList where description equals to
        defaultVisitFiltering("description.equals=" + DEFAULT_DESCRIPTION, "description.equals=" + UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllVisitsByDescriptionIsInShouldWork() throws Exception {
        // Initialize the database
        insertedVisit = visitRepository.saveAndFlush(visit);

        // Get all the visitList where description in
        defaultVisitFiltering("description.in=" + DEFAULT_DESCRIPTION + "," + UPDATED_DESCRIPTION, "description.in=" + UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllVisitsByDescriptionIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedVisit = visitRepository.saveAndFlush(visit);

        // Get all the visitList where description is not null
        defaultVisitFiltering("description.specified=true", "description.specified=false");
    }

    @Test
    @Transactional
    void getAllVisitsByDescriptionContainsSomething() throws Exception {
        // Initialize the database
        insertedVisit = visitRepository.saveAndFlush(visit);

        // Get all the visitList where description contains
        defaultVisitFiltering("description.contains=" + DEFAULT_DESCRIPTION, "description.contains=" + UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllVisitsByDescriptionNotContainsSomething() throws Exception {
        // Initialize the database
        insertedVisit = visitRepository.saveAndFlush(visit);

        // Get all the visitList where description does not contain
        defaultVisitFiltering("description.doesNotContain=" + UPDATED_DESCRIPTION, "description.doesNotContain=" + DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllVisitsByPetIsEqualToSomething() throws Exception {
        Pet pet;
        if (TestUtil.findAll(em, Pet.class).isEmpty()) {
            visitRepository.saveAndFlush(visit);
            pet = PetResourceIT.createEntity();
        } else {
            pet = TestUtil.findAll(em, Pet.class).get(0);
        }
        em.persist(pet);
        em.flush();
        visit.setPet(pet);
        visitRepository.saveAndFlush(visit);
        Long petId = pet.getId();
        // Get all the visitList where pet equals to petId
        defaultVisitShouldBeFound("petId.equals=" + petId);

        // Get all the visitList where pet equals to (petId + 1)
        defaultVisitShouldNotBeFound("petId.equals=" + (petId + 1));
    }

    private void defaultVisitFiltering(String shouldBeFound, String shouldNotBeFound) throws Exception {
        defaultVisitShouldBeFound(shouldBeFound);
        defaultVisitShouldNotBeFound(shouldNotBeFound);
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultVisitShouldBeFound(String filter) throws Exception {
        restVisitMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(visit.getId().intValue())))
            .andExpect(jsonPath("$.[*].visitDate").value(hasItem(DEFAULT_VISIT_DATE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));

        // Check, that the count call also returns 1
        restVisitMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultVisitShouldNotBeFound(String filter) throws Exception {
        restVisitMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restVisitMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingVisit() throws Exception {
        // Get the visit
        restVisitMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVisit() throws Exception {
        // Initialize the database
        insertedVisit = visitRepository.saveAndFlush(visit);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the visit
        Visit updatedVisit = visitRepository.findById(visit.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedVisit are not directly saved in db
        em.detach(updatedVisit);
        updatedVisit.visitDate(UPDATED_VISIT_DATE).description(UPDATED_DESCRIPTION);
        VisitDTO visitDTO = visitMapper.toDto(updatedVisit);

        restVisitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, visitDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(visitDTO))
            )
            .andExpect(status().isOk());

        // Validate the Visit in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedVisitToMatchAllProperties(updatedVisit);
    }

    @Test
    @Transactional
    void putNonExistingVisit() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        visit.setId(longCount.incrementAndGet());

        // Create the Visit
        VisitDTO visitDTO = visitMapper.toDto(visit);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVisitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, visitDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(visitDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Visit in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVisit() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        visit.setId(longCount.incrementAndGet());

        // Create the Visit
        VisitDTO visitDTO = visitMapper.toDto(visit);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVisitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(visitDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Visit in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVisit() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        visit.setId(longCount.incrementAndGet());

        // Create the Visit
        VisitDTO visitDTO = visitMapper.toDto(visit);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVisitMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(visitDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Visit in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVisitWithPatch() throws Exception {
        // Initialize the database
        insertedVisit = visitRepository.saveAndFlush(visit);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the visit using partial update
        Visit partialUpdatedVisit = new Visit();
        partialUpdatedVisit.setId(visit.getId());

        partialUpdatedVisit.visitDate(UPDATED_VISIT_DATE).description(UPDATED_DESCRIPTION);

        restVisitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVisit.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedVisit))
            )
            .andExpect(status().isOk());

        // Validate the Visit in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertVisitUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedVisit, visit), getPersistedVisit(visit));
    }

    @Test
    @Transactional
    void fullUpdateVisitWithPatch() throws Exception {
        // Initialize the database
        insertedVisit = visitRepository.saveAndFlush(visit);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the visit using partial update
        Visit partialUpdatedVisit = new Visit();
        partialUpdatedVisit.setId(visit.getId());

        partialUpdatedVisit.visitDate(UPDATED_VISIT_DATE).description(UPDATED_DESCRIPTION);

        restVisitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVisit.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedVisit))
            )
            .andExpect(status().isOk());

        // Validate the Visit in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertVisitUpdatableFieldsEquals(partialUpdatedVisit, getPersistedVisit(partialUpdatedVisit));
    }

    @Test
    @Transactional
    void patchNonExistingVisit() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        visit.setId(longCount.incrementAndGet());

        // Create the Visit
        VisitDTO visitDTO = visitMapper.toDto(visit);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVisitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, visitDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(visitDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Visit in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVisit() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        visit.setId(longCount.incrementAndGet());

        // Create the Visit
        VisitDTO visitDTO = visitMapper.toDto(visit);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVisitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(visitDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Visit in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVisit() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        visit.setId(longCount.incrementAndGet());

        // Create the Visit
        VisitDTO visitDTO = visitMapper.toDto(visit);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVisitMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(visitDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Visit in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVisit() throws Exception {
        // Initialize the database
        insertedVisit = visitRepository.saveAndFlush(visit);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the visit
        restVisitMockMvc
            .perform(delete(ENTITY_API_URL_ID, visit.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return visitRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Visit getPersistedVisit(Visit visit) {
        return visitRepository.findById(visit.getId()).orElseThrow();
    }

    protected void assertPersistedVisitToMatchAllProperties(Visit expectedVisit) {
        assertVisitAllPropertiesEquals(expectedVisit, getPersistedVisit(expectedVisit));
    }

    protected void assertPersistedVisitToMatchUpdatableProperties(Visit expectedVisit) {
        assertVisitAllUpdatablePropertiesEquals(expectedVisit, getPersistedVisit(expectedVisit));
    }
}
