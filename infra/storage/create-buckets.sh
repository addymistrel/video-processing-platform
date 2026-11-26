#!/bin/sh
set -eu

aws_s3() {
  aws --endpoint-url "$S3_ENDPOINT" "$@"
}

attempts=0
until aws_s3 s3api list-buckets >/dev/null 2>&1; do
  attempts=$((attempts + 1))
  if [ "$attempts" -ge 30 ]; then
    echo 'storage is not reachable, giving up' >&2
    exit 1
  fi
  sleep 2
done

for bucket in $S3_BUCKETS; do
  if aws_s3 s3api head-bucket --bucket "$bucket" 2>/dev/null; then
    echo "bucket exists: $bucket"
  else
    aws_s3 s3api create-bucket --bucket "$bucket"
    echo "bucket created: $bucket"
  fi
done
