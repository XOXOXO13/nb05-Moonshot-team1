import {
  PersistSubTaskEntity,
  SubTaskEntity,
} from "../../domain/entities/subtask/subtask-entity";
import {
  SubTaskResDto,
  SubTaskResDtos,
} from "../../inbound/responses/subtask-res-dto";

export class SubTaskMapper {
  static toResDto(entity: PersistSubTaskEntity) {
    return new SubTaskResDto({
      id: entity.id,
      title: entity.title,
      taskId: entity.taskId,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toResDtos(entities: PersistSubTaskEntity[]) {
      return entities.map((entity) => {
        return new SubTaskResDto({
          id: entity.id,
          title: entity.title,
          taskId: entity.taskId,
          status: entity.status,
          createdAt: entity.createdAt,
          updatedAt: entity.updatedAt,
        });
      })
  }

  static toPersistEntity(params: {
    id: number;
    title: string;
    status: string;
    taskId: number;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return SubTaskEntity.createPersist({
      id: params.id,
      title: params.title,
      status: params.status,
      taskId: params.taskId,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    });
  }
}
