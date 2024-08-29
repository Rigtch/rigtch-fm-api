import { CacheInterceptor } from '@nestjs/cache-manager'
import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { ReportsService } from '../reports.service'

import { ReportsListeningQuery, ReportsTotalItemsQuery } from './dtos'
import { TotalItemsDocument } from './docs'
import {
  ApiReportsListeningQuery,
  ApiReportsTotalItemsQuery,
} from './decorators'

import { ApiAuth } from '@common/decorators'
import { TimeRangeGuard } from '@modules/stats/router/guards'
import { ApiUser, RequestUser } from '@modules/users/decorators'
import { ValidateUserIdGuard } from '@modules/users/guards'
import { User } from '@modules/users'
import { MANY_SUCCESSFULLY_RETRIEVED } from '@common/constants'
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

  @Get('total-tracks')
  @ApiOperation({
    summary: "Getting user's total listened tracks (cached).",
    description:
      "Getting user's total listened tracks, used for creating charts (cached).",
  })
  @ApiOkResponse({
    description: MANY_SUCCESSFULLY_RETRIEVED('total tracks'),
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
    description: MANY_SUCCESSFULLY_RETRIEVED('total artists'),
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
    description: MANY_SUCCESSFULLY_RETRIEVED('total albums'),
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
