import { QueueEventsHost, QueueEventsListener } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'

import { HISTORY_QUEUE } from './constants'

@QueueEventsListener(HISTORY_QUEUE)
@Injectable()
export class HistoryQueueEvents extends QueueEventsHost {}
