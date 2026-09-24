package fr.vmz.jhipster.petclinic.config.audit;

import fr.vmz.jhipster.petclinic.config.Constants;
import fr.vmz.jhipster.petclinic.security.SecurityUtils;
import org.javers.spring.auditable.AuthorProvider;
import org.springframework.stereotype.Component;

@Component
public class JaversAuthorProvider implements AuthorProvider {

    @Override
    public String provide() {
        return SecurityUtils.getCurrentUserLogin().orElse(Constants.SYSTEM);
    }
}
