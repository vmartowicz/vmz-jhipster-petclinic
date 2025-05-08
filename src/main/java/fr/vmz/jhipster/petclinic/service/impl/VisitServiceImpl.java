package fr.vmz.jhipster.petclinic.service.impl;

import fr.vmz.jhipster.petclinic.domain.Visit;
import fr.vmz.jhipster.petclinic.repository.VisitRepository;
import fr.vmz.jhipster.petclinic.service.VisitService;
import fr.vmz.jhipster.petclinic.service.dto.VisitDTO;
import fr.vmz.jhipster.petclinic.service.mapper.VisitMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link fr.vmz.jhipster.petclinic.domain.Visit}.
 */
@Service
@Transactional
public class VisitServiceImpl implements VisitService {

    private static final Logger LOG = LoggerFactory.getLogger(VisitServiceImpl.class);

    private final VisitRepository visitRepository;

    private final VisitMapper visitMapper;

    public VisitServiceImpl(VisitRepository visitRepository, VisitMapper visitMapper) {
        this.visitRepository = visitRepository;
        this.visitMapper = visitMapper;
    }

    @Override
    public VisitDTO save(VisitDTO visitDTO) {
        LOG.debug("Request to save Visit : {}", visitDTO);
        Visit visit = visitMapper.toEntity(visitDTO);
        visit = visitRepository.save(visit);
        return visitMapper.toDto(visit);
    }

    @Override
    public VisitDTO update(VisitDTO visitDTO) {
        LOG.debug("Request to update Visit : {}", visitDTO);
        Visit visit = visitMapper.toEntity(visitDTO);
        visit.setIsPersisted();
        visit = visitRepository.save(visit);
        return visitMapper.toDto(visit);
    }

    @Override
    public Optional<VisitDTO> partialUpdate(VisitDTO visitDTO) {
        LOG.debug("Request to partially update Visit : {}", visitDTO);

        return visitRepository
            .findById(visitDTO.getId())
            .map(existingVisit -> {
                visitMapper.partialUpdate(existingVisit, visitDTO);

                return existingVisit;
            })
            .map(visitRepository::save)
            .map(visitMapper::toDto);
    }

    public Page<VisitDTO> findAllWithEagerRelationships(Pageable pageable) {
        return visitRepository.findAllWithEagerRelationships(pageable).map(visitMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<VisitDTO> findOne(Long id) {
        LOG.debug("Request to get Visit : {}", id);
        return visitRepository.findOneWithEagerRelationships(id).map(visitMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete Visit : {}", id);
        visitRepository.deleteById(id);
    }
}
