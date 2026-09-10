package fr.vmz.jhipster.petclinic.service.mapper;

import static fr.vmz.jhipster.petclinic.domain.SpecialtyAsserts.*;
import static fr.vmz.jhipster.petclinic.domain.SpecialtyTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class SpecialtyMapperTest {

    private SpecialtyMapper specialtyMapper;

    @BeforeEach
    void setUp() {
        specialtyMapper = new SpecialtyMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getSpecialtySample1();
        var actual = specialtyMapper.toEntity(specialtyMapper.toDto(expected));
        assertSpecialtyAllPropertiesEquals(expected, actual);
    }
}
