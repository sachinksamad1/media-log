export abstract class MediaMapper<DomainEntity, ResponseDto> {
  abstract toDto(entity: DomainEntity): ResponseDto;

  toDtoList(entities: DomainEntity[]): ResponseDto[] {
    return entities.map((entity) => this.toDto(entity));
  }
}
