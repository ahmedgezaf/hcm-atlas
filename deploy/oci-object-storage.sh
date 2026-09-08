#!/usr/bin/env bash
#
# Publish dist/index.html to an OCI Object Storage bucket and print the URL.
#
#   ./deploy/oci-object-storage.sh -c <compartment-ocid> [-b bucket] [-r region]
#
# Needs the OCI CLI, configured once with `oci setup config`.
# Re-running it just re-uploads: the bucket is only created the first time.
#
set -euo pipefail

BUCKET="hcm-atlas"
COMPARTMENT="${OCI_COMPARTMENT_OCID:-}"
REGION=""
PRIVATE=0

usage() { sed -n '2,10p' "$0" | sed 's/^# \{0,1\}//'; exit "${1:-0}"; }

while getopts ":c:b:r:ph" opt; do
  case "$opt" in
    c) COMPARTMENT="$OPTARG" ;;
    b) BUCKET="$OPTARG" ;;
    r) REGION="$OPTARG" ;;
    p) PRIVATE=1 ;;
    h) usage 0 ;;
    *) usage 1 ;;
  esac
done

command -v oci >/dev/null || { echo "OCI CLI not found. See https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/cliinstall.htm"; exit 1; }
[ -n "$COMPARTMENT" ] || { echo "Missing compartment OCID. Pass -c ocid1.compartment.oc1..… or set OCI_COMPARTMENT_OCID."; exit 1; }

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FILE="$ROOT/dist/index.html"
[ -f "$FILE" ] || { echo "dist/index.html not found. Run: python3 build.py"; exit 1; }

REGION_ARG=()
[ -n "$REGION" ] && REGION_ARG=(--region "$REGION")

NAMESPACE="$(oci os ns get "${REGION_ARG[@]}" --query 'data' --raw-output)"
[ -z "$REGION" ] && REGION="$(oci iam region-subscription list --query 'data[?"is-home-region"].["region-name"]|[0][0]' --raw-output)"

echo "namespace : $NAMESPACE"
echo "region    : $REGION"
echo "bucket    : $BUCKET"

if ! oci os bucket get --bucket-name "$BUCKET" "${REGION_ARG[@]}" >/dev/null 2>&1; then
  echo "creating bucket…"
  ACCESS="ObjectRead"
  [ "$PRIVATE" -eq 1 ] && ACCESS="NoPublicAccess"
  oci os bucket create \
    --compartment-id "$COMPARTMENT" \
    --name "$BUCKET" \
    --public-access-type "$ACCESS" \
    "${REGION_ARG[@]}" >/dev/null
else
  echo "bucket exists, reusing"
fi

# Content-Type matters: without it Object Storage serves application/octet-stream
# and the browser downloads the file instead of rendering it.
oci os object put \
  --bucket-name "$BUCKET" \
  --name index.html \
  --file "$FILE" \
  --content-type "text/html; charset=utf-8" \
  --cache-control "public, max-age=300" \
  --force \
  "${REGION_ARG[@]}" >/dev/null

URL="https://objectstorage.${REGION}.oraclecloud.com/n/${NAMESPACE}/b/${BUCKET}/o/index.html"

if [ "$PRIVATE" -eq 1 ]; then
  EXPIRES="$(date -u -d '+30 days' +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -v+30d +%Y-%m-%dT%H:%M:%SZ)"
  echo "creating a 30-day pre-authenticated request…"
  PAR_PATH="$(oci os preauth-request create \
    --bucket-name "$BUCKET" \
    --name "hcm-atlas-$(date +%Y%m%d)" \
    --access-type ObjectRead \
    --object-name index.html \
    --time-expires "$EXPIRES" \
    "${REGION_ARG[@]}" --query 'data."access-uri"' --raw-output)"
  echo
  echo "  https://objectstorage.${REGION}.oraclecloud.com${PAR_PATH}"
  echo "  (expires $EXPIRES — anyone with the link can read it)"
else
  echo
  echo "  $URL"
fi
