#!/bin/bash

function loadAppFixtures() {
  fixtures-ts-node-commonjs load \
          ./src/fixtures/app/theme.yml \
          ./src/fixtures/app/level.yml \
          ./src/fixtures/app/boat.yml \
          ./src/fixtures/app/weapon.yml \
          --dataSource=./datasource.ts \
          --debug \
          --ignoreDecorators \
          --sync
}

function loadTestFixtures() {
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
}
