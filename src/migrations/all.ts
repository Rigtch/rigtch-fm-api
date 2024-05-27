import { Migration1697539455661 } from './1697539455661-migration'
import { FixUserProfileRelation1701713313421 } from './1701713313421-fix-user-profile-relation'
import { HistoryMigration1711027664648 } from './1711027664648-history-migration'
import { ChangeUniqueConstraintsForEntities1711444943012 } from './1711444943012-change-unique-constraints-for-entities'
import { RemoveHistoryEntity1716207087982 } from './1716207087982-remove-history-entity'
import { AddTrackNumberAndDiscNumberPropertiesToUserEntity1716804618570 } from './1716804618570-add-track-number-and-disc-number-properties-to-user-entity'

export const migrations = [
  Migration1697539455661,
  FixUserProfileRelation1701713313421,
  HistoryMigration1711027664648,
  ChangeUniqueConstraintsForEntities1711444943012,
  RemoveHistoryEntity1716207087982,
  AddTrackNumberAndDiscNumberPropertiesToUserEntity1716804618570,
]
