#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="${1:-wordpress-src}"
LOCALE="${2:-zh_CN}"

if ! command -v curl >/dev/null 2>&1; then
  echo "Error: curl is required" >&2
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "Error: python3 is required" >&2
  exit 1
fi

TMP_JSON="$(mktemp)"
trap 'rm -f "$TMP_JSON"' EXIT

curl -fsSL "https://api.wordpress.org/core/version-check/1.7/?locale=${LOCALE}" -o "$TMP_JSON"

META_JSON="$(python3 - <<'PY' "$TMP_JSON"
import json, sys
with open(sys.argv[1], 'r', encoding='utf-8') as f:
    data = json.load(f)
offer = data['offers'][0]
version = offer['current']
download = offer['download']
locale = offer.get('locale') or 'en_US'
print(json.dumps({
    'version': version,
    'download': download,
    'locale': locale,
}, ensure_ascii=False))
PY
)"

LATEST="$(python3 - <<'PY' "$META_JSON"
import json, sys
print(json.loads(sys.argv[1])['version'])
PY
)"

DOWNLOAD_URL="$(python3 - <<'PY' "$META_JSON"
import json, sys
print(json.loads(sys.argv[1])['download'])
PY
)"

RESOLVED_LOCALE="$(python3 - <<'PY' "$META_JSON"
import json, sys
print(json.loads(sys.argv[1])['locale'])
PY
)"

ARCHIVE_NAME="$(basename "$DOWNLOAD_URL")"
CHECKSUM_URL="${DOWNLOAD_URL}.md5"

mkdir -p "$TARGET_DIR"

echo "Latest WordPress version: ${LATEST}"
echo "Locale: ${RESOLVED_LOCALE}"
echo "Downloading: ${DOWNLOAD_URL}"
curl -fL "$DOWNLOAD_URL" -o "$TARGET_DIR/${ARCHIVE_NAME}"
curl -fsSL "$CHECKSUM_URL" -o "$TARGET_DIR/${ARCHIVE_NAME}.md5"

(
  cd "$TARGET_DIR"
  EXPECTED_MD5="$(tr -d '[:space:]' < "${ARCHIVE_NAME}.md5")"
  ACTUAL_MD5="$(md5sum "${ARCHIVE_NAME}" | awk '{print $1}')"

  if [[ "$EXPECTED_MD5" != "$ACTUAL_MD5" ]]; then
    echo "Checksum verification failed for ${ARCHIVE_NAME}" >&2
    echo "Expected: $EXPECTED_MD5" >&2
    echo "Actual:   $ACTUAL_MD5" >&2
    exit 1
  fi

  case "${ARCHIVE_NAME}" in
    *.zip)
      if ! command -v unzip >/dev/null 2>&1; then
        echo "Error: unzip is required to extract ${ARCHIVE_NAME}" >&2
        exit 1
      fi
      unzip -q -o "${ARCHIVE_NAME}"
      ;;
    *.tar.gz)
      tar -xzf "${ARCHIVE_NAME}"
      ;;
    *)
      echo "Error: unsupported archive format: ${ARCHIVE_NAME}" >&2
      exit 1
      ;;
  esac
)

echo "Done. Source extracted to: ${TARGET_DIR}/wordpress"
