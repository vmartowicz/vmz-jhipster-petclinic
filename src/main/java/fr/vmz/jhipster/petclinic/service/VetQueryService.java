package fr.vmz.jhipster.petclinic.service;

import fr.vmz.jhipster.petclinic.domain.*; // for static metamodels
import fr.vmz.jhipster.petclinic.domain.Vet;
import fr.vmz.jhipster.petclinic.repository.VetRepository;
import fr.vmz.jhipster.petclinic.service.criteria.VetCriteria;
import fr.vmz.jhipster.petclinic.service.dto.VetDTO;
import fr.vmz.jhipster.petclinic.service.mapper.VetMapper;
import jakarta.persistence.criteria.JoinType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

/**
 * Service for executing complex queries for {@link Vet} entities in the database.
 * The main input is a {@link VetCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link Page} of {@link VetDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class VetQueryService extends QueryService<Vet> {

    private static final Logger LOG = LoggerFactory.getLogger(VetQueryService.class);

    private final VetRepository vetRepository;

    private final VetMapper vetMapper;

    public VetQueryService(VetRepository vetRepository, VetMapper vetMapper) {
        this.vetRepository = vetRepository;
        this.vetMapper = vetMapper;
    }

    /**
     * Return a {@link Page} of {@link VetDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<VetDTO> findByCriteria(VetCriteria criteria, Pageable page) {
        LOG.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Vet> specification = createSpecification(criteria);
        return vetRepository.fetchBagRelationships(vetRepository.findAll(specification, page)).map(vetMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(VetCriteria criteria) {
        LOG.debug("count by criteria : {}", criteria);
        final Specification<Vet> specification = createSpecification(criteria);
        return vetRepository.count(specification);
    }

    /**
     * Function to convert {@link VetCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<Vet> createSpecification(VetCriteria criteria) {
        Specification<Vet> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            if (criteria.getDistinct() != null) {
                specification = specification.and(distinct(criteria.getDistinct()));
            }
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), Vet_.id));
            }
            if (criteria.getFirstName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getFirstName(), Vet_.firstName));
            }
            if (criteria.getLastName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getLastName(), Vet_.lastName));
            }
            if (criteria.getCreatedBy() != null) {
                specification = specification.and(buildStringSpecification(criteria.getCreatedBy(), Vet_.createdBy));
            }
            if (criteria.getCreatedDate() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getCreatedDate(), Vet_.createdDate));
            }
            if (criteria.getLastModifiedBy() != null) {
                specification = specification.and(buildStringSpecification(criteria.getLastModifiedBy(), Vet_.lastModifiedBy));
            }
            if (criteria.getLastModifiedDate() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getLastModifiedDate(), Vet_.lastModifiedDate));
            }
            if (criteria.getSpecialtiesId() != null) {
                specification = specification.and(
                    buildSpecification(criteria.getSpecialtiesId(), root -> root.join(Vet_.specialties, JoinType.LEFT).get(Specialty_.id))
                );
            }
        }
        return specification;
    }
}
