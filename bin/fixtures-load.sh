fixtures-ts-node-commonjs load \
        ./src/fixtures/media.yml \
        ./src/fixtures/theme.yml \
        ./src/fixtures/media-with-theme.yml \
        ./src/fixtures/level.yml \
        ./src/fixtures/character.yml \
        ./src/fixtures/boat.yml \
        ./src/fixtures/weapon.yml \
        ./src/fixtures/user.yml \
        ./src/fixtures/game.yml \
        --dataSource=./datasource.ts \
        --debug \
        --ignoreDecorators \
        --sync
