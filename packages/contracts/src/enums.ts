import { z } from 'zod';

const VIDEO_STATUSES = [
  'UPLOADING',
  'UPLOADED',
  'QUEUED',
  'PROCESSING',
  'READY',
  'FAILED',
] as const;

const videoStatusSchema = z.enum(VIDEO_STATUSES);
type VideoStatus = z.infer<typeof videoStatusSchema>;

const JOB_STATUSES = ['PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED', 'DEAD'] as const;

const jobStatusSchema = z.enum(JOB_STATUSES);
type JobStatus = z.infer<typeof jobStatusSchema>;

const JOB_TYPES = ['PROBE', 'THUMBNAIL', 'TRANSCODE', 'HLS'] as const;

const jobTypeSchema = z.enum(JOB_TYPES);
type JobType = z.infer<typeof jobTypeSchema>;

const RENDITIONS = ['1080p', '720p', '480p', '360p'] as const;

const renditionSchema = z.enum(RENDITIONS);
type Rendition = z.infer<typeof renditionSchema>;

export {
  JOB_STATUSES,
  JOB_TYPES,
  jobStatusSchema,
  jobTypeSchema,
  RENDITIONS,
  renditionSchema,
  VIDEO_STATUSES,
  videoStatusSchema,
};

export type { JobStatus, JobType, Rendition, VideoStatus };
