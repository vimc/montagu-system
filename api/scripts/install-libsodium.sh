set -e

mkdir -p lib

libsodium_version=libsodium-1.0.16

curl https://download.libsodium.org/libsodium/releases/$libsodium_version.tar.gz \
    | tar xz --directory lib/

cd lib/$libsodium_version/

./configure
make
make check
make install

cd -
