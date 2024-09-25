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
import { TypeColumnNullableInItemsEntities1717685923338 } from './1717685923338-type-column-nullable-in-items-entities'
import { MakeItemsColumnsRequired1717699326064 } from './1717699326064-make-items-columns-required'
import { EnableCache1717744803994 } from './1717744803994-enable-cache'
import { DisableCache1717771878472 } from './1717771878472-disable-cache'
import { AddCreatedAtColumnToUserEntity1721641599620 } from './1721641599620-add-created-at-column-to-user-entity'
import { AddUserFollowersAndFollowing1727274883625 } from './1727274883625-add-user-followers-and-following'
import { AddFollowersAndFollowingCountToUser1727277320574 } from './1727277320574-add-followers-and-following-count-to-user'

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
  TypeColumnNullableInItemsEntities1717685923338,
  MakeItemsColumnsRequired1717699326064,
  EnableCache1717744803994,
  DisableCache1717771878472,
  AddCreatedAtColumnToUserEntity1721641599620,
  AddUserFollowersAndFollowing1727274883625,
  AddFollowersAndFollowingCountToUser1727277320574,
]
