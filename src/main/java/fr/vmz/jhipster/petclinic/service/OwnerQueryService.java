package fr.vmz.jhipster.petclinic.service;

import fr.vmz.jhipster.petclinic.domain.*; // for static metamodels
import fr.vmz.jhipster.petclinic.domain.Owner;
import fr.vmz.jhipster.petclinic.repository.OwnerRepository;
import fr.vmz.jhipster.petclinic.service.criteria.OwnerCriteria;
import fr.vmz.jhipster.petclinic.service.dto.OwnerDTO;
import fr.vmz.jhipster.petclinic.service.mapper.OwnerMapper;
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
 * Service for executing complex queries for {@link Owner} entities in the database.
 * The main input is a {@link OwnerCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link Page} of {@link OwnerDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class OwnerQueryService extends QueryService<Owner> {

    private static final Logger LOG = LoggerFactory.getLogger(OwnerQueryService.class);

    private final OwnerRepository ownerRepository;

    private final OwnerMapper ownerMapper;

    public OwnerQueryService(OwnerRepository ownerRepository, OwnerMapper ownerMapper) {
        this.ownerRepository = ownerRepository;
        this.ownerMapper = ownerMapper;
    }

    /**
     * Return a {@link Page} of {@link OwnerDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<OwnerDTO> findByCriteria(OwnerCriteria criteria, Pageable page) {
        LOG.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Owner> specification = createSpecification(criteria);
        return ownerRepository.findAll(specification, page).map(ownerMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(OwnerCriteria criteria) {
        LOG.debug("count by criteria : {}", criteria);
        final Specification<Owner> specification = createSpecification(criteria);
        return ownerRepository.count(specification);
    }

    /**
     * Function to convert {@link OwnerCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<Owner> createSpecification(OwnerCriteria criteria) {
        Specification<Owner> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            if (criteria.getDistinct() != null) {
                specification = specification.and(distinct(criteria.getDistinct()));
            }
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), Owner_.id));
            }
            if (criteria.getFirstName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getFirstName(), Owner_.firstName));
            }
            if (criteria.getLastName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getLastName(), Owner_.lastName));
            }
            if (criteria.getAddress() != null) {
                specification = specification.and(buildStringSpecification(criteria.getAddress(), Owner_.address));
            }
            if (criteria.getCity() != null) {
                specification = specification.and(buildStringSpecification(criteria.getCity(), Owner_.city));
            }
            if (criteria.getTelephone() != null) {
                specification = specification.and(buildStringSpecification(criteria.getTelephone(), Owner_.telephone));
            }
            if (criteria.getCreatedBy() != null) {
                specification = specification.and(buildStringSpecification(criteria.getCreatedBy(), Owner_.createdBy));
            }
            if (criteria.getCreatedDate() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getCreatedDate(), Owner_.createdDate));
            }
            if (criteria.getLastModifiedBy() != null) {
                specification = specification.and(buildStringSpecification(criteria.getLastModifiedBy(), Owner_.lastModifiedBy));
            }
            if (criteria.getLastModifiedDate() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getLastModifiedDate(), Owner_.lastModifiedDate));
            }
            if (criteria.getPetsId() != null) {
                specification = specification.and(
                    buildSpecification(criteria.getPetsId(), root -> root.join(Owner_.pets, JoinType.LEFT).get(Pet_.id))
                );
            }
        }
        return specification;
    }
}
