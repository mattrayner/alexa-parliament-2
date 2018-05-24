#!/usr/bin/env bash

mkdir -p ~/.aws

cat > ~/.aws/credentials << EOL
[default]
aws_access_key_id = foo
aws_secret_access_key = bar
region=eu-west-1
EOL