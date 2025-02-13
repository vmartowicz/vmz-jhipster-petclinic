package fr.vmz.jhipster.petclinic.domain;

import static fr.vmz.jhipster.petclinic.domain.OwnerTestSamples.*;
import static fr.vmz.jhipster.petclinic.domain.PetTestSamples.*;
import static fr.vmz.jhipster.petclinic.domain.PetTypeTestSamples.*;
import static fr.vmz.jhipster.petclinic.domain.VisitTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import fr.vmz.jhipster.petclinic.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class PetTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Pet.class);
        Pet pet1 = getPetSample1();
        Pet pet2 = new Pet();
        assertThat(pet1).isNotEqualTo(pet2);

        pet2.setId(pet1.getId());
        assertThat(pet1).isEqualTo(pet2);

        pet2 = getPetSample2();
        assertThat(pet1).isNotEqualTo(pet2);
    }

    @Test
    void visitsTest() {
        Pet pet = getPetRandomSampleGenerator();
        Visit visitBack = getVisitRandomSampleGenerator();

        pet.addVisits(visitBack);
        assertThat(pet.getVisits()).containsOnly(visitBack);
        assertThat(visitBack.getPet()).isEqualTo(pet);

        pet.removeVisits(visitBack);
        assertThat(pet.getVisits()).doesNotContain(visitBack);
        assertThat(visitBack.getPet()).isNull();

        pet.visits(new HashSet<>(Set.of(visitBack)));
        assertThat(pet.getVisits()).containsOnly(visitBack);
        assertThat(visitBack.getPet()).isEqualTo(pet);

        pet.setVisits(new HashSet<>());
        assertThat(pet.getVisits()).doesNotContain(visitBack);
        assertThat(visitBack.getPet()).isNull();
    }

    @Test
    void typeTest() {
        Pet pet = getPetRandomSampleGenerator();
        PetType petTypeBack = getPetTypeRandomSampleGenerator();

        pet.setType(petTypeBack);
        assertThat(pet.getType()).isEqualTo(petTypeBack);

        pet.type(null);
        assertThat(pet.getType()).isNull();
    }

    @Test
    void ownerTest() {
        Pet pet = getPetRandomSampleGenerator();
        Owner ownerBack = getOwnerRandomSampleGenerator();

        pet.setOwner(ownerBack);
        assertThat(pet.getOwner()).isEqualTo(ownerBack);

        pet.owner(null);
        assertThat(pet.getOwner()).isNull();
    }
}
