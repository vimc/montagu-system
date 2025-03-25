#!/usr/bin/env bash

TEST_EMAIL='test.user@example.com'
TEST_PASSWORD_ENCODED='$2y$10$snpZ8bgdkh2hy8lDtyHF7ejD5.K1vsMqaFteCkmBhdBQj3JTlJRM6'
TEST_UUID='29fe3a97-6e10-4bcc-8d83-79aee5027ae8'

docker exec montagu-packit-db-1 create-super-user --email "$TEST_EMAIL" --password "$TEST_PASSWORD_ENCODED" --uuid "$TEST_UUID"