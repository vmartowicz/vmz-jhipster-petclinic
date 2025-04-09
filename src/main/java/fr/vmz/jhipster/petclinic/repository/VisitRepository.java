package fr.vmz.jhipster.petclinic.repository;

import fr.vmz.jhipster.petclinic.domain.Visit;
import java.util.List;
import java.util.Optional;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Visit entity.
 */
@Repository
@JaversSpringDataAuditable
public interface VisitRepository extends JpaRepository<Visit, Long>, JpaSpecificationExecutor<Visit> {
    default Optional<Visit> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Visit> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Visit> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(value = "select visit from Visit visit left join fetch visit.pet", countQuery = "select count(visit) from Visit visit")
    Page<Visit> findAllWithToOneRelationships(Pageable pageable);

    @Query("select visit from Visit visit left join fetch visit.pet")
    List<Visit> findAllWithToOneRelationships();

    @Query("select visit from Visit visit left join fetch visit.pet where visit.id =:id")
    Optional<Visit> findOneWithToOneRelationships(@Param("id") Long id);
}
