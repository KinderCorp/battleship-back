#!/bin/bash

fixtures-ts-node-commonjs load \
        ./src/fixtures/test/theme.yml \
        ./src/fixtures/test/level.yml \
        ./src/fixtures/test/character.yml \
        ./src/fixtures/test/boat.yml \
        ./src/fixtures/test/weapon.yml \
        ./src/fixtures/test/user.yml \
        ./src/fixtures/test/game.yml \
        --dataSource=./datasource.ts \
        --debug \
        --ignoreDecorators \
        --sync
