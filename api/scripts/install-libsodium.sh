curl https://download.libsodium.org/libsodium/releases/libsodium-1.0.12.tar.gz \
    | tar xz --directory lib/
pushd lib/libsodium-1.0.12/
./configure
make && make check
sudo make install
popd