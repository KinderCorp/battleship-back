#!/bin/bash

BOLD_RED="\e[01;31m"
GREEN="\e[00;32m"
YELLOW="\e[00;33m"
BOLD_YELLOW="\e[01;33m"
BLUE="\e[00;94m"
BOLD_GREEN="\e[01;32m"
END_COLOR="\e[0m"

fixture_choice=("test" "app")

start() {
    source ./bin/get-choice.sh
    getChoice --query "Choose a fixture to load :" --options fixture_choice

    # shellcheck disable=SC2154
    local fixture="${selectedChoice}"

    clear

    printf "${BLUE} You chose ${BOLD_GREEN}$fixture${END_COLOR}\\n"
    printf "${BOLD_RED}Are you sure ? ${YELLOW}y or ${BOLD_YELLOW}N${END_COLOR} : "
    read
        printf "${BOLD_GREEN}";
        case $(echo $REPLY | tr '[A-Z]' '[a-z]') in
            y|yes) printf "\\n${GREEN}Loading fixtures ...${END_COLOR}\\n"

             if [ $fixture == "app" ]
             then
               source ./bin/fixture-loader.sh
               loadAppFixtures

             elif [ $fixture == "test" ];
             then
               source ./bin/fixture-loader.sh
               loadTestFixtures

             fi;
             exit 0;;
            *)     echo "No. Exiting script..."; exit 0 ;;
        esac
}

main() {
  start
  "$@"
}

main "$@"