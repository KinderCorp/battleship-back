fixtures-ts-node-commonjs load \
        ./src/fixtures/media.yml \
        ./src/fixtures/theme.yml \
        ./src/fixtures/media-with-theme.yml \
        ./src/fixtures/level.yml \
        ./src/fixtures/character.yml \
        ./src/fixtures/boat.yml \
        --dataSource=./datasource.ts \
        --debug \
        --ignoreDecorators \
        --sync
