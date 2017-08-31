FROM montagu-api-build-environment

RUN ./gradlew :generateTestData:compileKotlin

CMD ./gradlew :generateTestData \
  && ./user.sh add "Test User" test.user test.user@imperial.ac.uk password \
  && ./user.sh addRole test.user user \
  && ./user.sh addUserToGroup test.user IC-Garske
