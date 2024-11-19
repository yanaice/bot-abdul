#!/bin/bash

rm -f function.zip

zip -r function.zip . -x "*.git*" "*.sh" "*.md" "node_modules/*"

# gcloud functions deploy abdul-bot \
# --gen2 \
# --runtime=nodejs20 \
# --region=asia-southeast1 \
# --source=function.zip \
# --entry-point=lineWebhook \
# --trigger-http \
# --allow-unauthenticated
