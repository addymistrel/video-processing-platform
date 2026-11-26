import { z } from 'zod';
import { jobTypeSchema, renditionSchema } from './enums.js';

const EVENT_TYPES = {
  videoUploaded: 'video.uploaded',
  videoProcess: 'video.process',
  videoProgress: 'video.processing.progress',
  videoReady: 'video.ready',
  videoFailed: 'video.failed',
} as const;

const envelopeSchema = z.object({
  messageId: z.uuid(),
  traceId: z.string().min(1),
  occurredAt: z.iso.datetime(),
  schemaVersion: z.literal(1),
  attempt: z.number().int().min(0).default(0),
});

const videoUploadedEventSchema = envelopeSchema.extend({
  type: z.literal(EVENT_TYPES.videoUploaded),
  payload: z.object({
    videoId: z.uuid(),
    ownerId: z.uuid(),
    objectKey: z.string().min(1),
    sizeBytes: z.number().int().nonnegative(),
  }),
});

const processVideoJobSchema = envelopeSchema.extend({
  type: z.literal(EVENT_TYPES.videoProcess),
  payload: z.object({
    jobId: z.uuid(),
    videoId: z.uuid(),
    jobType: jobTypeSchema,
    objectKey: z.string().min(1),
  }),
});

const videoProgressEventSchema = envelopeSchema.extend({
  type: z.literal(EVENT_TYPES.videoProgress),
  payload: z.object({
    jobId: z.uuid(),
    videoId: z.uuid(),
    step: jobTypeSchema,
    percent: z.number().min(0).max(100),
  }),
});

const videoReadyEventSchema = envelopeSchema.extend({
  type: z.literal(EVENT_TYPES.videoReady),
  payload: z.object({
    videoId: z.uuid(),
    masterPlaylistKey: z.string().min(1),
    renditions: z.array(renditionSchema).min(1),
  }),
});

const videoFailedEventSchema = envelopeSchema.extend({
  type: z.literal(EVENT_TYPES.videoFailed),
  payload: z.object({
    jobId: z.uuid(),
    videoId: z.uuid(),
    reason: z.string().min(1),
    permanent: z.boolean(),
  }),
});

const platformEventSchema = z.discriminatedUnion('type', [
  videoUploadedEventSchema,
  processVideoJobSchema,
  videoProgressEventSchema,
  videoReadyEventSchema,
  videoFailedEventSchema,
]);

type VideoUploadedEvent = z.infer<typeof videoUploadedEventSchema>;
type ProcessVideoJob = z.infer<typeof processVideoJobSchema>;
type VideoProgressEvent = z.infer<typeof videoProgressEventSchema>;
type VideoReadyEvent = z.infer<typeof videoReadyEventSchema>;
type VideoFailedEvent = z.infer<typeof videoFailedEventSchema>;
type PlatformEvent = z.infer<typeof platformEventSchema>;

export {
  envelopeSchema,
  EVENT_TYPES,
  platformEventSchema,
  processVideoJobSchema,
  videoFailedEventSchema,
  videoProgressEventSchema,
  videoReadyEventSchema,
  videoUploadedEventSchema,
};

export type {
  PlatformEvent,
  ProcessVideoJob,
  VideoFailedEvent,
  VideoProgressEvent,
  VideoReadyEvent,
  VideoUploadedEvent,
};
