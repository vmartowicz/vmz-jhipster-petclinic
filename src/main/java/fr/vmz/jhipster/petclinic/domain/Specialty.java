package fr.vmz.jhipster.petclinic.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.domain.Persistable;

/**
 * A Specialty.
 */
@Entity
@Table(name = "specialties")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@JsonIgnoreProperties(value = { "new" })
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Specialty extends AbstractAuditingEntity<Long> implements Serializable, Persistable<Long> {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 80)
    @Column(name = "name", length = 80, nullable = false)
    private String name;

    // Inherited createdBy definition
    // Inherited createdDate definition
    // Inherited lastModifiedBy definition
    // Inherited lastModifiedDate definition
    @org.springframework.data.annotation.Transient
    @Transient
    private boolean isPersisted;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "specialties")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "specialties" }, allowSetters = true)
    private Set<Vet> vets = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Specialty id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Specialty name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    // Inherited createdBy methods
    public Specialty createdBy(String createdBy) {
        this.setCreatedBy(createdBy);
        return this;
    }

    // Inherited createdDate methods
    public Specialty createdDate(Instant createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    // Inherited lastModifiedBy methods
    public Specialty lastModifiedBy(String lastModifiedBy) {
        this.setLastModifiedBy(lastModifiedBy);
        return this;
    }

    // Inherited lastModifiedDate methods
    public Specialty lastModifiedDate(Instant lastModifiedDate) {
        this.setLastModifiedDate(lastModifiedDate);
        return this;
    }

    @PostLoad
    @PostPersist
    public void updateEntityState() {
        this.setIsPersisted();
    }

    @org.springframework.data.annotation.Transient
    @Transient
    @Override
    public boolean isNew() {
        return !this.isPersisted;
    }

    public Specialty setIsPersisted() {
        this.isPersisted = true;
        return this;
    }

    public Set<Vet> getVets() {
        return this.vets;
    }

    public void setVets(Set<Vet> vets) {
        if (this.vets != null) {
            this.vets.forEach(i -> i.removeSpecialties(this));
        }
        if (vets != null) {
            vets.forEach(i -> i.addSpecialties(this));
        }
        this.vets = vets;
    }

    public Specialty vets(Set<Vet> vets) {
        this.setVets(vets);
        return this;
    }

    public Specialty addVets(Vet vet) {
        this.vets.add(vet);
        vet.getSpecialties().add(this);
        return this;
    }

    public Specialty removeVets(Vet vet) {
        this.vets.remove(vet);
        vet.getSpecialties().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Specialty)) {
            return false;
        }
        return getId() != null && getId().equals(((Specialty) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Specialty{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", lastModifiedBy='" + getLastModifiedBy() + "'" +
            ", lastModifiedDate='" + getLastModifiedDate() + "'" +
            "}";
    }
}
