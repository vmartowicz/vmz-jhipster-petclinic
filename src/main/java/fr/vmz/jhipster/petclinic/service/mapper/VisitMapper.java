package fr.vmz.jhipster.petclinic.service.mapper;

import fr.vmz.jhipster.petclinic.domain.Pet;
import fr.vmz.jhipster.petclinic.domain.Visit;
import fr.vmz.jhipster.petclinic.service.dto.PetDTO;
import fr.vmz.jhipster.petclinic.service.dto.VisitDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Visit} and its DTO {@link VisitDTO}.
 */
@Mapper(componentModel = "spring")
public interface VisitMapper extends EntityMapper<VisitDTO, Visit> {
    @Mapping(target = "pet", source = "pet", qualifiedByName = "petName")
    VisitDTO toDto(Visit s);

    @Named("petName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    PetDTO toDtoPetName(Pet pet);
}
