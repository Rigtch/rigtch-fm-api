import { InjectQueue } from '@nestjs/bullmq'

import { HISTORY_QUEUE } from '../constants'

export const InjectHistoryQueue = () => InjectQueue(HISTORY_QUEUE)
