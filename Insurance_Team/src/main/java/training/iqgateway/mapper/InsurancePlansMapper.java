package training.iqgateway.mapper;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import training.iqgateway.dto.InsurancePlansDTO;
import training.iqgateway.model.InsurancePlansEO;

public class InsurancePlansMapper {

    // --- EO -> DTO ---
    public static InsurancePlansDTO toDTO(InsurancePlansEO eo) {
        if (eo == null) return null;
        InsurancePlansDTO dto = new InsurancePlansDTO();
        dto.setId(eo.getId());
        dto.setTitle(eo.getTitle());
        dto.setAmount(eo.getAmount());
        dto.setValidity(eo.getValidity());
        dto.setExclusion(eo.getExclusion());

        if (eo.getCovers() != null) {
            dto.setCovers(
                eo.getCovers().stream()
                  .filter(Objects::nonNull)
                  .map(InsurancePlansMapper::convertCoverEOtoDTO)
                  .collect(Collectors.toList())
            );
        }
        return dto;
    }

    // --- DTO -> EO ---
    public static InsurancePlansEO toEO(InsurancePlansDTO dto) {
        if (dto == null) return null;
        InsurancePlansEO eo = new InsurancePlansEO();
        eo.setId(dto.getId());
        eo.setTitle(dto.getTitle());
        eo.setAmount(dto.getAmount());
        eo.setValidity(dto.getValidity());
        eo.setExclusion(dto.getExclusion());

        if (dto.getCovers() != null) {
            eo.setCovers(
                dto.getCovers().stream()
                  .filter(Objects::nonNull)
                  .map(InsurancePlansMapper::convertCoverDTOtoEO)
                  .collect(Collectors.toList())
            );
        }
        return eo;
    }

    // --- Helper: EO Cover -> DTO Cover ---
    public static InsurancePlansDTO.CoverDTO convertCoverEOtoDTO(InsurancePlansEO.Cover eo) {
        if (eo == null) return null;
        return new InsurancePlansDTO.CoverDTO(
            eo.getCoverId(),
            eo.getCoverName(),
            eo.getDescription(),
            eo.getCoverAmount()
        );
    }

    // --- Helper: DTO Cover -> EO Cover ---
    public static InsurancePlansEO.Cover convertCoverDTOtoEO(InsurancePlansDTO.CoverDTO dto) {
        if (dto == null) return null;
        return new InsurancePlansEO.Cover(
            dto.getCoverId(),
            dto.getCoverName(),
            dto.getDescription(),
            dto.getCoverAmount()
        );
    }

    // -- Optionally, for lists --
    public static List<InsurancePlansDTO> toDTOList(List<InsurancePlansEO> eoList) {
        return eoList == null ? null : eoList.stream().map(InsurancePlansMapper::toDTO).collect(Collectors.toList());
    }
    public static List<InsurancePlansEO> toEOList(List<InsurancePlansDTO> dtoList) {
        return dtoList == null ? null : dtoList.stream().map(InsurancePlansMapper::toEO).collect(Collectors.toList());
    }
}
