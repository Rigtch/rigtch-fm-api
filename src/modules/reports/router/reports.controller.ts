import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CacheInterceptor } from '@nestjs/cache-manager'

import { ReportsService } from '../reports.service'

import { ReportsListeningQuery, ReportsTotalItemsQuery } from './dtos'
import {
  GenresListeningDaysDocument,
  ListeningDaysDocument,
  TotalItemsDocument,
} from './docs'
import {
  ApiReportsListeningQuery,
  ApiReportsTotalItemsQuery,
} from './decorators'

import { ApiAuth } from '@common/decorators'
import { TimeRangeGuard } from '@modules/stats/router/guards'
import { ApiUser, RequestUser } from '@modules/users/decorators'
import { ValidateUserIdGuard } from '@modules/users/guards'
import { User } from '@modules/users'
import {
  MANY_SUCCESSFULLY_RETRIEVED,
  ONE_SUCCESSFULLY_RETRIEVED,
} from '@common/constants'
import { StatsMeasurement } from '@modules/stats/enums'

@Controller('/users/:id/reports')
@ApiTags('users/{id}/reports')
@UseGuards(ValidateUserIdGuard, TimeRangeGuard)
@UseInterceptors(CacheInterceptor)
@ApiAuth()
@ApiUser()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('listening-days')
  @ApiOperation({
    summary: "Getting user's listening days (cached).",
    description:
      "Getting user's listening days, used for creating charts (cached).",
  })
  @ApiOkResponse({
    description: MANY_SUCCESSFULLY_RETRIEVED('listening days'),
    type: [ListeningDaysDocument],
  })
  @ApiReportsListeningQuery()
  getListeningDays(
    @RequestUser() user: User,
    @Query()
    {
      before = new Date(),
      after,
      measurement = StatsMeasurement.PLAYS,
    }: ReportsListeningQuery
  ) {
    return this.reportsService.getListeningDays(
      {
        before,
        after,
        measurement,
      },
      user
    )
  }

  @Get('genres-listening-days')
  @ApiOperation({
    summary: "Getting user's genres listening days (cached).",
    description:
      "Getting user's genres listening days, used for creating charts (cached).",
  })
  @ApiOkResponse({
    description: MANY_SUCCESSFULLY_RETRIEVED('genres listening days'),
    type: [GenresListeningDaysDocument],
  })
  @ApiReportsListeningQuery()
  getGenresListeningDays(
    @RequestUser() user: User,
    @Query()
    {
      before = new Date(),
      after,
      measurement = StatsMeasurement.PLAYS,
    }: ReportsListeningQuery
  ) {
    return this.reportsService.getGenresListeningDays(
      {
        before,
        after,
        measurement,
      },
      user
    )
  }

  @Get('listening-hours')
  @ApiOperation({
    summary: "Getting user's listening hours (cached).",
    description:
      "Getting user's listening hours, used for creating charts (cached).",
  })
  @ApiReportsListeningQuery()
  getListeningHours(
    @RequestUser() user: User,
    @Query()
    {
      before = new Date(),
      after,
      measurement = StatsMeasurement.PLAYS,
    }: ReportsListeningQuery
  ) {
    return this.reportsService.getListeningHours(
      {
        before,
        after,
        measurement,
      },
      user
    )
  }

  @Get('total-genres')
  @ApiOperation({
    summary: "Getting user's total listened genres (cached).",
    description:
      "Getting user's total listened genres, used for creating charts (cached).",
  })
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_RETRIEVED('total genre'),
    type: TotalItemsDocument,
  })
  @ApiReportsTotalItemsQuery()
  async getTotalGenres(
    @RequestUser() user: User,
    @Query() { before = new Date(), after }: ReportsTotalItemsQuery
  ) {
    return {
      total: await this.reportsService.getTotalGenres(
        {
          before,
          after,
        },
        user
      ),
    }
  }

  @Get('total-playtime')
  @ApiOperation({
    summary: "Getting user's total listened playtime (cached).",
    description:
      "Getting user's total listened playtime, used for creating charts (cached).",
  })
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_RETRIEVED('total playtime'),
    type: TotalItemsDocument,
  })
  @ApiReportsTotalItemsQuery()
  async getTotalPlaytime(
    @RequestUser() user: User,
    @Query() { before = new Date(), after }: ReportsTotalItemsQuery
  ) {
    return {
      total: await this.reportsService.getTotalPlaytime(
        {
          before,
          after,
        },
        user
      ),
    }
  }

  @Get('total-plays')
  @ApiOperation({
    summary: "Getting user's total listened plays (cached).",
    description:
      "Getting user's total listened plays, used for creating charts (cached).",
  })
  @ApiOkResponse({
    description: MANY_SUCCESSFULLY_RETRIEVED('total play'),
    type: TotalItemsDocument,
  })
  @ApiReportsTotalItemsQuery()
  async getTotalPlays(
    @RequestUser() user: User,
    @Query() { before = new Date(), after }: ReportsTotalItemsQuery
  ) {
    return {
      total: await this.reportsService.getTotalPlays(
        {
          before,
          after,
        },
        user
      ),
    }
  }

  @Get('total-tracks')
  @ApiOperation({
    summary: "Getting user's total listened tracks (cached).",
    description:
      "Getting user's total listened tracks, used for creating charts (cached).",
  })
  @ApiOkResponse({
    description: MANY_SUCCESSFULLY_RETRIEVED('total track'),
    type: TotalItemsDocument,
  })
  @ApiReportsTotalItemsQuery()
  async getTotalTracks(
    @RequestUser() user: User,
    @Query() { before = new Date(), after }: ReportsTotalItemsQuery
  ) {
    return {
      total: await this.reportsService.getTotalTracks(
        {
          before,
          after,
        },
        user
      ),
    }
  }

  @Get('total-artists')
  @ApiOperation({
    summary: "Getting user's total listened artists (cached).",
    description:
      "Getting user's total listened artists, used for creating charts (cached).",
  })
  @ApiOkResponse({
    description: MANY_SUCCESSFULLY_RETRIEVED('total artist'),
    type: TotalItemsDocument,
  })
  @ApiReportsTotalItemsQuery()
  async getTotalArtists(
    @RequestUser() user: User,
    @Query() { before = new Date(), after }: ReportsTotalItemsQuery
  ) {
    return {
      total: await this.reportsService.getTotalArtists(
        {
          before,
          after,
        },
        user
      ),
    }
  }

  @Get('total-albums')
  @ApiOperation({
    summary: "Getting user's total listened albums (cached).",
    description:
      "Getting user's total listened albums, used for creating charts (cached).",
  })
  @ApiOkResponse({
    description: MANY_SUCCESSFULLY_RETRIEVED('total album'),
    type: TotalItemsDocument,
  })
  @ApiReportsTotalItemsQuery()
  async getTotalAlbums(
    @RequestUser() user: User,
    @Query() { before = new Date(), after }: ReportsTotalItemsQuery
  ) {
    return {
      total: await this.reportsService.getTotalAlbums(
        {
          before,
          after,
        },
        user
      ),
    }
  }
}
