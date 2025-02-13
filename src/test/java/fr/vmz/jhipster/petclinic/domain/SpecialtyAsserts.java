package fr.vmz.jhipster.petclinic.domain;

import static org.assertj.core.api.Assertions.assertThat;

public class SpecialtyAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertSpecialtyAllPropertiesEquals(Specialty expected, Specialty actual) {
        assertSpecialtyAutoGeneratedPropertiesEquals(expected, actual);
        assertSpecialtyAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertSpecialtyAllUpdatablePropertiesEquals(Specialty expected, Specialty actual) {
        assertSpecialtyUpdatableFieldsEquals(expected, actual);
        assertSpecialtyUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertSpecialtyAutoGeneratedPropertiesEquals(Specialty expected, Specialty actual) {
        assertThat(actual)
            .as("Verify Specialty auto generated properties")
            .satisfies(a -> assertThat(a.getId()).as("check id").isEqualTo(expected.getId()))
            .satisfies(a -> assertThat(a.getCreatedBy()).as("check createdBy").isEqualTo(expected.getCreatedBy()))
            .satisfies(a -> assertThat(a.getCreatedDate()).as("check createdDate").isEqualTo(expected.getCreatedDate()))
            .satisfies(a -> assertThat(a.getLastModifiedBy()).as("check lastModifiedBy").isEqualTo(expected.getLastModifiedBy()))
            .satisfies(a -> assertThat(a.getLastModifiedDate()).as("check lastModifiedDate").isEqualTo(expected.getLastModifiedDate()));
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertSpecialtyUpdatableFieldsEquals(Specialty expected, Specialty actual) {
        assertThat(actual)
            .as("Verify Specialty relevant properties")
            .satisfies(a -> assertThat(a.getName()).as("check name").isEqualTo(expected.getName()));
    }

    /**
     * Asserts that the entity has all the updatable relationships set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertSpecialtyUpdatableRelationshipsEquals(Specialty expected, Specialty actual) {
        assertThat(actual)
            .as("Verify Specialty relationships")
            .satisfies(a -> assertThat(a.getVets()).as("check vets").isEqualTo(expected.getVets()));
    }
}
