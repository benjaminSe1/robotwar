function iaGenerator(mapSize) {
    var positionRel = {x: "", y: ""};
    var isXGood = false;
    var isYGood = false;
    var thereIsAWinner = false;
    var winnerPos = {x: "", y: ""};

    return {
        /**
         * getName - Retourne ici ton nom de guerrier
         *
         * @return {string}
         */
        getName: function getName() {
            return "Beep";
        },

        /**
         * onFriendWins - fonction qui est appelée quand un ami gagne
         *
         * @param {Object} exit - la positions de la sortie { x: ... , y: ... }
         * @return {void}
         */
        onFriendWins: function onFriendWins(exit) {
            thereIsAWinner = true;
            winnerPos.x = exit.x;
            winnerPos.y = exit.y;
        },

        /**
         * onResponseX - fonction appelée quand le jeux nous donne
         * la position horizontale relative de notre joueur par rapport à la sortie
         *
         * @param {number} hPosition
         * @return {void}
         */
        onResponseX: function onResponseX(hPosition) {
            positionRel.x = hPosition;
        },

        /**
         * onResponseY - fonction appelée quand le jeux nous donne
         * la position verticale relative de notre joueur par rapport à la sortie
         *
         * @param {number} hPosition
         * @return {void}
         */
        onResponseY: function (vPosition) {
            positionRel.y = vPosition;
        },

        /**
         * action - fonction appelée par le moteur de jeu à chaque tour
         * ici, il faut retourner un object qui décrit
         * l'action que doit faire le bot pour ce tour.
         *
         * @param {object} position - la position actuelle de votre bot
         * @param {number} round - le numéro de tour en cours
         * @return {object} action - l'action à effectuer
         */
        action: function action(position, round, walls) {
            var action = {};
            if (thereIsAWinner) {
                action = {
                    action: "teleport",
                    params: {
                        x: winnerPos.x,
                        y: winnerPos.y
                    }
                }
            }
            if (round % 5 === 0 && !isXGood && !isYGood) {
                positionRel.x = null;
                positionRel.y = null;   
            } else if (round % 5 == 0 && !isXGood) {
                positionRel.x = null;
            } else if (round % 5 == 0 && !isYGood) {
                positionRel.y = null;
            }
            if (positionRel.x == null && !isXGood && round % 5 == 0) {
                action = {
                    action: "ask",
                    params: "x" //ou y
                }
                return action;
            } else if (positionRel.y == null && !isYGood && round % 5 == 1) {
                action = {
                    action: "ask",
                    params: "y" //ou y
                }
                return action;
            } else {
                if (!isXGood && !isYGood) {
                    action = {
                        action: "move",
                        params: {
                            dx: positionRel.x, //1 mouvement positif, -1 mouvement négatif, 0 aucun mouvement sur cet axe
                            dy: positionRel.y
                        }
                    }
                }
                else if (!isXGood) {
                    action = {
                        action: "move",
                        params: {
                            dx: positionRel.x, //1 mouvement positif, -1 mouvement négatif, 0 aucun mouvement sur cet axe
                            dy: 0
                        }
                    }
                } else if (!isYGood) {
                    action = {
                        action: "move",
                        params: {
                            dx: 0, //1 mouvement positif, -1 mouvement négatif, 0 aucun mouvement sur cet axe
                            dy: positionRel.y
                        }
                    }
                }
                return action;
            }
        }
    };
}

module.ex