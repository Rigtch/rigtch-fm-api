import { Migration1697539455661 } from './1697539455661-migration'
import { FixUserProfileRelation1701713313421 } from './1701713313421-fix-user-profile-relation'
import { HistoryMigration1711027664648 } from './1711027664648-history-migration'

export const migrations = [
  Migration1697539455661,
  FixUserProfileRelation1701713313421,
  HistoryMigration1711027664648,
]
