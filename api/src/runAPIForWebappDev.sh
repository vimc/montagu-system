./gradlew :stopDatabase

./gradlew :startDatabase :blackboxTests:run \
&& ./user.sh add "Test User" test.user test@example.com password \
&& ./user.sh addRole test.user user \
&& ./gradlew :run