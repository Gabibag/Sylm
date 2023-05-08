let Games = {

}
const GAME_ID_LENGTH = 8;
let symbols = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
function createGameId(){
    let id = ""
    for (let i = 0; i < GAME_ID_LENGTH; i++){
        id += symbols[Math.floor(Math.random() * symbols.length)]
    }
    if (Games[id]){
        return createGameId()
    }
    return id
}
let NewGame = function(){
    id = createGameId();
    Games[id] = InitGame()
    return id
}
let InitGame = function(){
    //TODO
    return {
    }
}
exports.NewGame = NewGame
exports.Games = Games
