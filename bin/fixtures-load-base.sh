#!/bin/bash

fixtures-ts-node-commonjs load \
        ./src/fixtures/base/theme.yml \
        ./src/fixtures/base/level.yml \
        ./src/fixtures/base/boat.yml \
        ./src/fixtures/base/weapon.yml \
        --dataSource=./datasource.ts \
        --debug \
        --ignoreDecorators \
        --sync
