FROM harmonyone/localnet-test

# Setup hmy with default accounts
# Main funding account
RUN hmy keys import-private-key 144109d9b1182b51233955c112f64a545bb70143539f161e936bb01f8b1e081d
# Accounts for Ganache
RUN hmy keys import-private-key 59f46b7addacb231e75932d384c5c75d5e9a84920609b5d27a57922244efbf90
RUN hmy keys import-private-key d8ee0370d50f5d32c50704f4a0d01f027ab048d9cdb2f137b7ae852d8590d63f
RUN hmy keys import-private-key ff356a09310ab648ace558574ca84777f21612f6652867776095a95919a47314
RUN hmy keys import-private-key ed6e49719b1d7c82f364bf843d3d17bb5fd7af8a773cdc18c710c2642566cefa
RUN hmy keys import-private-key 330032b37bdcd8d8f3d9aae0c8403dcbb24915362493e998f7e0b631f20d3f91
RUN hmy keys import-private-key 4e856590fc9233cfc215e5bffe4efdb9611d8e2db78d38be24e02b469fddb5a5
RUN hmy keys import-private-key 4d00a5621249165d7fb76bac56cd01786b64a301fffba0137c5fa997c3069163
RUN hmy keys import-private-key 5b2984da0bb75e22208dc3baf8f5a1eb86099418c6b3516d132c70199ce67c65
RUN hmy keys import-private-key 86cc025e63f934f80e4377a022df3623abbdb5a5803089fe80ffb86dad76b864
RUN hmy keys import-private-key 5709f12bc34677a96ed3f01898329eedb0d78a499159ad5a541cdce8c77a3de3

# TODO: Remove the harmony one cloning when the harmonyone/localnet-test is updated.
WORKDIR $GOPATH/src/github.com/harmony-one

RUN git clone https://github.com/harmony-one/harmony.git

# Build to fetch all dependencies for faster test builds
RUN cd harmony && go get github.com/pborman/uuid && go get github.com/rjeczalik/notify \
    && go get github.com/cespare/cp && go get github.com/libp2p/go-libp2p-crypto && go get github.com/kr/pretty \
    && go get github.com/kr/text && go get gopkg.in/check.v1 && bash scripts/install_build_tools.sh && make

WORKDIR $GOPATH/src/github.com/harmony-one/harmony-test/localnet

COPY bootstrap bootstrap
COPY scripts scripts

RUN chmod +x $GOPATH/src/github.com/harmony-one/harmony-test/localnet/scripts/run-localnet.sh
WORKDIR $GOPATH/src/github.com/harmony-one/harmony
ENTRYPOINT ["/go/src/github.com/harmony-one/harmony-test/localnet/scripts/run-localnet.sh"]
