FROM montagu-api-build-environment

CMD ./gradlew :generateTestData \
  && ./user.sh add "Test User" test.user test.user@imperial.ac.uk password \
  && ./user.sh addRole test.user user \
  && ./user.sh addRole test.user member modelling-group IC-Garske
