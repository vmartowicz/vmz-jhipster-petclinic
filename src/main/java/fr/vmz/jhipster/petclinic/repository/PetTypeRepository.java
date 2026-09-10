package fr.vmz.jhipster.petclinic.repository;

import fr.vmz.jhipster.petclinic.domain.PetType;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the PetType entity.
 */
@SuppressWarnings("unused")
@Repository
@JaversSpringDataAuditable
public interface PetTypeRepository extends JpaRepository<PetType, Long> {}
