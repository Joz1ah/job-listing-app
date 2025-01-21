ENV_FILE="/app/.env"
RETRY_INTERVAL=2 
MAX_RETRIES=30

echo "Waiting for $ENV_FILE to be available..."

RETRIES=0
while [ ! -f "$ENV_FILE" ]; do
  RETRIES=$((RETRIES + 1))
  if [ "$RETRIES" -ge "$MAX_RETRIES" ]; then
    echo "Error: $ENV_FILE not found after $((RETRIES * RETRY_INTERVAL)) seconds."
    exit 1
  fi
  echo "Retry $RETRIES/$MAX_RETRIES: $ENV_FILE not found. Retrying in $RETRY_INTERVAL seconds..."
  sleep $RETRY_INTERVAL
done

echo "$ENV_FILE is available. Starting the application..."
exec "$@"