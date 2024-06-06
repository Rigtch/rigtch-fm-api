import { Migration1697539455661 } from './1697539455661-migration'
import { FixUserProfileRelation1701713313421 } from './1701713313421-fix-user-profile-relation'
import { HistoryMigration1711027664648 } from './1711027664648-history-migration'
import { ChangeUniqueConstraintsForEntities1711444943012 } from './1711444943012-change-unique-constraints-for-entities'
import { RemoveHistoryEntity1716207087982 } from './1716207087982-remove-history-entity'
import { AddTrackNumberAndDiscNumberPropertiesToUserEntity1716804618570 } from './1716804618570-add-track-number-and-disc-number-properties-to-user-entity'
import { MakeDiscNumberAndTrackNumberPropertiesRequiredInUserEntity1716814787203 } from './1716814787203-make-disc-number-and-track-number-properties-required-in-user-entity'
import { AddReleaseDatePrecisionColumnToAlbumEntity1717144663672 } from './1717144663672-add-release-date-precision-column-to-album-entity'
import { AddExplicitColumnToTrackEntity1717684160130 } from './1717684160130-add-explicit-column-to-track-entity'
import { AddCopyrightsLabelAndGenresColumnsToAlbumEntity1717685603039 } from './1717685603039-add-copyrights-label-and-genres-columns-to-album-entity'

export const migrations = [
  Migration1697539455661,
  FixUserProfileRelation1701713313421,
  HistoryMigration1711027664648,
  ChangeUniqueConstraintsForEntities1711444943012,
  RemoveHistoryEntity1716207087982,
  AddTrackNumberAndDiscNumberPropertiesToUserEntity1716804618570,
  MakeDiscNumberAndTrackNumberPropertiesRequiredInUserEntity1716814787203,
  AddReleaseDatePrecisionColumnToAlbumEntity1717144663672,
  AddExplicitColumnToTrackEntity1717684160130,
  AddCopyrightsLabelAndGenresColumnsToAlbumEntity1717685603039,
]
