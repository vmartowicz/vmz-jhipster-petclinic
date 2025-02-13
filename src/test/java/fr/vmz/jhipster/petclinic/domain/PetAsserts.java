package fr.vmz.jhipster.petclinic.domain;

import static org.assertj.core.api.Assertions.assertThat;

public class PetAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertPetAllPropertiesEquals(Pet expected, Pet actual) {
        assertPetAutoGeneratedPropertiesEquals(expected, actual);
        assertPetAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertPetAllUpdatablePropertiesEquals(Pet expected, Pet actual) {
        assertPetUpdatableFieldsEquals(expected, actual);
        assertPetUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertPetAutoGeneratedPropertiesEquals(Pet expected, Pet actual) {
        assertThat(actual)
            .as("Verify Pet auto generated properties")
            .satisfies(a -> assertThat(a.getId()).as("check id").isEqualTo(expected.getId()))
            .satisfies(a -> assertThat(a.getCreatedBy()).as("check createdBy").isEqualTo(expected.getCreatedBy()))
            .satisfies(a -> assertThat(a.getCreatedDate()).as("check createdDate").isEqualTo(expected.getCreatedDate())
            )// FIXME Following fields are automatically set by entity audit blueprint
        // .satisfies(a -> assertThat(a.getLastModifiedBy()).as("check lastModifiedBy").isEqualTo(expected.getLastModifiedBy()))
        //.satisfies(a -> assertThat(a.getLastModifiedDate()).as("check lastModifiedDate").isEqualTo(expected.getLastModifiedDate()))
        ;
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertPetUpdatableFieldsEquals(Pet expected, Pet actual) {
        assertThat(actual)
            .as("Verify Pet relevant properties")
            .satisfies(a -> assertThat(a.getName()).as("check name").isEqualTo(expected.getName()))
            .satisfies(a -> assertThat(a.getBirthDate()).as("check birthDate").isEqualTo(expected.getBirthDate()));
    }

    /**
     * Asserts that the entity has all the updatable relationships set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertPetUpdatableRelationshipsEquals(Pet expected, Pet actual) {
        assertThat(actual)
            .as("Verify Pet relationships")
            .satisfies(a -> assertThat(a.getType()).as("check type").isEqualTo(expected.getType()))
            .satisfies(a -> assertThat(a.getOwner()).as("check owner").isEqualTo(expected.getOwner()));
    }
}
