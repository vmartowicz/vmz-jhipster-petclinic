package fr.vmz.jhipster.petclinic.service.mapper;

import fr.vmz.jhipster.petclinic.domain.Owner;
import fr.vmz.jhipster.petclinic.service.dto.OwnerDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Owner} and its DTO {@link OwnerDTO}.
 */
@Mapper(componentModel = "spring")
public interface OwnerMapper extends EntityMapper<OwnerDTO, Owner> {}
