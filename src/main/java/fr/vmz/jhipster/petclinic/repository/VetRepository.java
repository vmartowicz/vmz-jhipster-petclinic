package fr.vmz.jhipster.petclinic.repository;

import fr.vmz.jhipster.petclinic.domain.Vet;
import java.util.List;
import java.util.Optional;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Vet entity.
 *
 * When extending this class, extend VetRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
@JaversSpringDataAuditable
public interface VetRepository extends VetRepositoryWithBagRelationships, JpaRepository<Vet, Long>, JpaSpecificationExecutor<Vet> {
    default Optional<Vet> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<Vet> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<Vet> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }
}
