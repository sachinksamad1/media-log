export abstract class BaseMapper<DomainEntity, ResponseDto> {
  abstract toDto(entity: DomainEntity): ResponseDto;

  toDtoList(entities: DomainEntity[]): ResponseDto[] {
    return entities.map((entity) => this.toDto(entity));
  }
}
