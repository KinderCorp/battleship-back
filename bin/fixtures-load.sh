#!/bin/bash

RED="\e[00;31m"
BOLD_RED="\e[01;31m"
GREEN="\e[00;32m"
YELLOW="\e[00;33m"
BOLD_YELLOW="\e[01;33m"
BLUE="\e[00;94m"
BOLD_GREEN="\e[01;32m"
END_COLOR="\e[0m"

options=(
    "test"
    "initialise base app"
)

PS3=$'\e[01;94mWhich fixture do you want to load ? \e[00;37m(1 or 2) \e[01;94m: \e[0m'
printf "${YELLOW}";
select option in "${options[@]}"
do
    printf "${BLUE}You chose : ${BOLD_GREEN}$option\\n${END_COLOR}";

    case $option in
      "test") path="test" ;;
      "initialise base app") path="base" ;;
      *) printf "${BOLD_RED}error${END_COLOR}" ; exit 1;;
    esac

printf "${BOLD_RED}Are you sure ? ${YELLOW}y or ${BOLD_YELLOW}N${END_COLOR} : "
read
    printf "${BOLD_GREEN}";
    case $(echo $REPLY | tr '[A-Z]' '[a-z]') in
        y|yes) printf "\\n${GREEN}Loading fixtures ...${END_COLOR}\\n"

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
        *)     echo "no"; exit 0 ;;
    esac
done
