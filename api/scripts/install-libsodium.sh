set -e

mkdir -p lib

curl https://download.libsodium.org/libsodium/releases/libsodium-1.0.12.tar.gz \
    | tar xz --directory lib/

cd lib/libsodium-1.0.12/

./configure
make
make check
make install

cd -
