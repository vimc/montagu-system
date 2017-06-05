set -e

cd src

./gradlew :startDatabase :generateTestData

docker exec montagu-api-test_database \
    pg_dump -h localhost -U vimc -d montagu --data-only > ../test-data.sql

./gradlew :stopDatabase