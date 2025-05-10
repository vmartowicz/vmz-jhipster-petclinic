package fr.vmz.jhipster.petclinic.config.audit;

public enum AuditedEntity {
    PETTYPE(fr.vmz.jhipster.petclinic.domain.PetType.class, "domain.PetType"),
    SPECIALTY(fr.vmz.jhipster.petclinic.domain.Specialty.class, "domain.Specialty"),
    VET(fr.vmz.jhipster.petclinic.domain.Vet.class, "domain.Vet"),
    OWNER(fr.vmz.jhipster.petclinic.domain.Owner.class, "domain.Owner"),
    PET(fr.vmz.jhipster.petclinic.domain.Pet.class, "domain.Pet"),
    VISIT(fr.vmz.jhipster.petclinic.domain.Visit.class, "domain.Visit");

    // jhipster-needle-add-audited-entities - JHipster will add entities to this enum

    private final Class<?> entityClass;
    private final String eventEntityType;

    private AuditedEntity(Class<?> entityClass, String eventEntityType) {
        this.entityClass = entityClass;
        this.eventEntityType = eventEntityType;
    }

    public Class<?> getEntityClass() {
        return entityClass;
    }

    public String getEventEntityType() {
        return eventEntityType;
    }
}
