package fr.vmz.jhipster.petclinic.service.mapper;

import fr.vmz.jhipster.petclinic.domain.Owner;
import fr.vmz.jhipster.petclinic.domain.Pet;
import fr.vmz.jhipster.petclinic.domain.PetType;
import fr.vmz.jhipster.petclinic.service.dto.OwnerDTO;
import fr.vmz.jhipster.petclinic.service.dto.PetDTO;
import fr.vmz.jhipster.petclinic.service.dto.PetTypeDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Pet} and its DTO {@link PetDTO}.
 */
@Mapper(componentModel = "spring")
public interface PetMapper extends EntityMapper<PetDTO, Pet> {
    @Mapping(target = "type", source = "type", qualifiedByName = "petTypeName")
    @Mapping(target = "owner", source = "owner", qualifiedByName = "ownerLastName")
    PetDTO toDto(Pet s);

    @Named("petTypeName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    PetTypeDTO toDtoPetTypeName(PetType petType);

    @Named("ownerLastName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "lastName", source = "lastName")
    OwnerDTO toDtoOwnerLastName(Owner owner);
}
