package fr.vmz.jhipster.petclinic.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class SpecialtyTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Specialty getSpecialtySample1() {
        return new Specialty().id(1L).name("name1").createdBy("createdBy1").lastModifiedBy("lastModifiedBy1");
    }

    public static Specialty getSpecialtySample2() {
        return new Specialty().id(2L).name("name2").createdBy("createdBy2").lastModifiedBy("lastModifiedBy2");
    }

    public static Specialty getSpecialtyRandomSampleGenerator() {
        return new Specialty()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
