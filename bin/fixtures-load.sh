#!/bin/bash

options=(
    "test"
    "initialise base app"
)

PS3="Which fixture do you want to load ?"

select option in "${options[@]}"
do
    echo $option

    case $option in
      "test") path="test" ;;
      "initialise base app") path="base" ;;
      *) echo "error" ; exit 1;;
    esac

    read -p "$1 ([y] or [n|N]): "
    case $(echo $REPLY | tr '[A-Z]' '[a-z]') in
        y|yes) echo "yes \\nLoading fixtures ..."

         if [ $path == "base" ]
         then
           fixtures-ts-node-commonjs load \
                   ./src/fixtures/base/theme.yml \
                   ./src/fixtures/base/level.yml \
                   ./src/fixtures/base/boat.yml \
                   ./src/fixtures/base/weapon.yml \
                   --dataSource=./datasource.ts \
                   --debug \
                   --ignoreDecorators \
                   --sync

         elif [ $path == "test" ];
         then
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

         fi;
         exit 0;;
        *)     echo "no" ;;
    esac
done
