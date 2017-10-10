//Binôme Benjamin et Mathis

function iaGenerator(mapSize) {
    var positionRel = {x: "", y: ""};
    var isXGood = false;
    var isYGood = false;
    var thereIsAWinner = false;
    var winnerPos = {x: "", y: ""};
    var isTp = false;

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
            if(hPosition == 0){
                isXGood = true;
            }
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
            if(vPosition == 0){
                isYGood = true;
            }
        },

        /**
         * action - fonction appelée par le moteur de jeu à chaque tour
         * ici, il faut retourner un object qui décrit
         * l'action que doit faire le bot pour ce tour.
         *
         * @param {object} position - la position actuelle de votre bot
         * @param {number} round - le numéro de tour en cours
         * @param {object} walls - les murs du jeu
         * @return {object} action - l'action à effectuer
         */
        action: function action(position, round, walls) {
            var action = {};
            if (thereIsAWinner && !isTp) {
                action = {
                    action: "teleport",
                    params: {
                        x: winnerPos.x-1,
                        y: winnerPos.y
                    }
                }
                isTp = true;
            }else if(thereIsAWinner && isTp){
                action = {
                    action: "move",
                    params: {
                        dx: 1,
                        dy: 0
                    }
                }
            }
            if (round % 3 === 0 && !isXGood && !isYGood) {
                //console.log("round % 3 === 0 && !isXGood && !isYGood");
                positionRel.x = null;
                positionRel.y = null;
            } else if (round % 3 == 0 && !isXGood) {
                //console.log("round % 3 == 0 && !isXGood");
                positionRel.x = null;
            } else if (round % 3 == 0 && !isYGood) {
                //console.log("round % 3 == 0 && !isYGood");
                positionRel.y = null;
            }
            if (positionRel.x == null && !isXGood && round % 3 == 0) {
                action = {
                    action: "ask",
                    params: "x" //ou y
                }
                return action;
            } else if (positionRel.y == null && !isYGood && round % 3 == 1) {
                action = {
                    action: "ask",
                    params: "y" //ou y
                }
                return action;
            } else {
                if (!isXGood && !isYGood) {
                    if(checkWall(position, walls, positionRel) == undefined){
                      console.log("Pas de mur");
                      action = {
                          action: "move",
                          params: {
                              dx: positionRel.x, //1 mouvement positif, -1 mouvement négatif, 0 aucun mouvement sur cet axe
                              dy: positionRel.y
                          }
                      }
                    }
                    else{
                      var par = checkWall(position, walls, positionRel);
                      console.log(par);
                      var parX = par.dx;
                      var parY = par.dy;
                      action = {
                          action: "move",
                          params: {
                            dx : parX,
                            dy : parY
                          }
                      }
                    }
                } else if (!isXGood) {
                  if(checkWall(position, walls, positionRel) == undefined){
                    console.log("Pas de mur");
                    action = {
                        action: "move",
                        params: {
                            dx: positionRel.x, //1 mouvement positif, -1 mouvement négatif, 0 aucun mouvement sur cet axe
                            dy: 0
                        }
                    }
                  }
                  else{
                    par = checkWall(position, walls, positionRel);
                    console.log(par);
                    parX = par.dx;
                    parY = par.dy;
                    action = {
                        action: "move",
                        params: {
                          dx : parX,
                          dy : parY
                        }
                    }
                  }
                } else if (!isYGood) {
                  if(checkWall(position, walls, positionRel) == undefined){
                    console.log("Pas de mur");
                    action = {
                        action: "move",
                        params: {
                            dx: 0, //1 mouvement positif, -1 mouvement négatif, 0 aucun mouvement sur cet axe
                            dy: positionRel.y
                        }
                    }
                  }
                  else{
                    par = checkWall(position, walls, positionRel);
                    console.log(par);
                    parX = par.dx;
                    parY = par.dy;
                    action = {
                        action: "move",
                        params: {
                          dx : parX,
                          dy : parY
                        }
                    }
                  }

                }
                return action;
            }
        }
    };
    function checkWall(pos, walls, positionRel){
      var tmpPosX = pos.x + positionRel.x;
      var tmpPosY = pos.y + positionRel.y;
      var tmp1 = false;
      var tmp2 = false;

        var isAWall = false;
        for(var i = 0; i < walls.length; i++){
            if(tmpPosX == walls[i].x && tmpPosY == walls[i].y){ //mur ou on va
                console.log("IsaWall");
                isAWall = true;
            }
        }
        if(!isAWall)return undefined;

        if(positionRel.x == -1 && positionRel.y == 0){
          console.log("Mur à gauche");
            for(i = 0; i < walls.length; i++){
                if(pos.x-1 == walls[i].x && pos.y == walls[i].y){ //mur à gauche
                  tmp1 = false;
                  tmp2 = false;
                    for(var j = 0; j < walls.length; j++){
                        if(pos.x-1 != walls[j].x && pos.y-1 != walls[j].y){
                            tmp1 = true;
                        }else{
                            tmp2 = true;
                        }
                    }
                    if(tmp1)return {dx : -1, dy : -1};
                    else return {dx : -1, dy : 1};
                }
            }
        }
        else if(positionRel.x == 1 && positionRel.y == 0){
          console.log("Mur à droite");
            for(i = 0; i < walls.length; i++){
                if(pos.x+1 == walls[i].x && pos.y == walls[i].y){ //mur à droite
                  tmp1 = false;
                  tmp2 = false;
                    for(j = 0; j < walls.length; j++){
                        if(pos.x+1 != walls[j].x && pos.y-1 != walls[j].y){
                            tmp1 = true;
                        }else{
                            tmp2 = true;
                        }
                    }
                    if(tmp1)return {dx : 1, dy : -1};
                    else return {dx : -1, dy : -1};
                }
            }
        }
        else if(positionRel.y == -1 && positionRel.x == 0){
          console.log("Mur à haut");
            for(i = 0; i < walls.length; i++){
                if(pos.x == walls[i].x && pos.y-1 == walls[i].y){ //mur en haut
                  tmp1 = false;
                  tmp2 = false;
                    for(j = 0; j < walls.length; j++){
                        if(pos.x-1 != walls[j].x && pos.y-1 != walls[j].y){
                            tmp1 = true;
                        }else{
                            tmp2 = true;
                        }
                    }
                    if(tmp1)return {dx : -1, dy : -1};
                    else return {dx : 1, dy : -1};
                }
            }
        }
        else if(positionRel.y == 1 && positionRel.x == 0){
          console.log("Mur à bas");
            for(i = 0; i < walls.length; i++){
                if(pos.x == walls[i].x && pos.y+1 == walls[i].y){ //mur en bas
                  tmp1 = false;
                  tmp2 = false;
                    for(j = 0; j < walls.length; j++){
                        if(pos.x-1 != walls[j].x && pos.y+1 != walls[j].y){
                            tmp1 = true;
                        }else{
                            tmp2 = true;
                        }
                    }
                    if(tmp1)return {dx : -1, dy : 1};
                    else return {dx : 1, dy : 1};
                }
            }
        }




        else if(positionRel.y == -1 && positionRel.x == -1){ //mur en haut a gauche
          console.log("Mur à haut gauche");
            for(i = 0; i < walls.length; i++){
                if(pos.x-1 == walls[i].x && pos.y-1 == walls[i].y){
                  tmp1 = false;
                  tmp2 = false;
                    for(j = 0; j < walls.length; j++){
                        if(pos.x != walls[j].x && pos.y+1 != walls[j].y){
                            tmp1 = true;
                        }else{
                            tmp2 = true;
                        }
                    }
                    if(tmp1)return {dx : 0, dy : 1};
                    else return {dx : -1, dy : 0};
                }
            }
        }
        else if(positionRel.y == -1 && positionRel.x == 1){
          console.log("Mur à haut droite");
            for(i = 0; i < walls.length; i++){
                if(pos.x+1 == walls[i].x && pos.y-1 == walls[i].y){ //mur en haut a droite
                  tmp1 = false;
                  tmp2 = false;
                    for(j = 0; j < walls.length; j++){
                        if(pos.x != walls[j].x && pos.y-1 != walls[j].y){
                            tmp1 = true;
                        }else{
                            tmp2 = true;
                        }
                    }
                    if(tmp1)return {dx : 0, dy : -1};
                    else return {dx : 1, dy : 0};
                }
            }
        }
        else if(positionRel.y == 1 && positionRel.x == -1){
          console.log("Mur à bas gauche");
            for(i = 0; i < walls.length; i++){
                if(pos.x-1 == walls[i].x && pos.y+1 == walls[i].y){ //mur en bas a gauche
                  tmp1 = false;
                  tmp2 = false;
                    for(j = 0; j < walls.length; j++){
                        if(pos.x != walls[j].x && pos.y+1 != walls[j].y){
                            tmp1 = true;
                        }else{
                            tmp2 = true;
                        }
                    }
                    if(tmp1) return {dx : 0, dy : 1};
                    else return {dx : -1, dy : 0};
                }
            }
        }
        else if(positionRel.y == 1 && positionRel.x == 1){
          console.log("Mur à bas droit");
            for(i = 0; i < walls.length; i++){
                if(pos.x+1 == walls[i].x && pos.y+1 == walls[i].y){ //mur en bas a droite
                  tmp1 = false;
                  tmp2 = false;
                    for(j = 0; j < walls.length; j++){
                        if(pos.x+1 != walls[j].x && pos.y != walls[j].y){
                            tmp1 = true;
                        }else{
                            tmp2 = true;
                        }
                    }
                  if(tmp1)return {dx : 1, dy : 0};
                  else return {dx : 0, dy : 1};
                }
            }
        }
        /*for(var i = 0; i < walls.length; i++){
            if(pos.x-1 == walls[i].x && pos.y == walls[i].y){ //mur à gauche

            }
            else if(pos.x+1 == walls[i].x && pos.y == walls[i].y){ //mur à droite
                return {dx : ""}
            }
            else if(pos.x == walls[i].x && pos.y+1 == walls[i].y){ //mur en bas
                return {dx : ""}
            }
            else if(pos.x == walls[i].x && pos.y-1 == walls[i].y){ //mur en haut
                return {dx : ""}
            }



            else if(pos.x+1 == walls[i].x && pos.y+1 == walls[i].y){ //mur bas a droite
                return {dx : ""}
            }
            else if(pos.x+1 == walls[i].x && pos.y-1 == walls[i].y){ //mur en haut a droite
                return {dx : ""}
            }
            else if(pos.x-1 == walls[i].x && pos.y-1 == walls[i].y){ //mur en haut à gauche
                return {dx : ""}
            }
            else if(pos.x-1 == walls[i].x && pos.y+1 == walls[i].y){ //mur en bas à gauche
                return {dx : ""}
            }
        }*/
        else{
          return undefined;
        }
    }
}

module.exports = iaGenerator;
