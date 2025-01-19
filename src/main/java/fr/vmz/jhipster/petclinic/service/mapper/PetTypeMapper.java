package fr.vmz.jhipster.petclinic.service.mapper;

import fr.vmz.jhipster.petclinic.domain.PetType;
import fr.vmz.jhipster.petclinic.service.dto.PetTypeDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link PetType} and its DTO {@link PetTypeDTO}.
 */
@Mapper(componentModel = "spring")
public interface PetTypeMapper extends EntityMapper<PetTypeDTO, PetType> {}
