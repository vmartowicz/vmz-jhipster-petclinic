package fr.vmz.jhipster.petclinic.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class VisitTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Visit getVisitSample1() {
        return new Visit().id(1L).description("description1").createdBy("createdBy1").lastModifiedBy("lastModifiedBy1");
    }

    public static Visit getVisitSample2() {
        return new Visit().id(2L).description("description2").createdBy("createdBy2").lastModifiedBy("lastModifiedBy2");
    }

    public static Visit getVisitRandomSampleGenerator() {
        return new Visit()
            .id(longCount.incrementAndGet())
            .description(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
