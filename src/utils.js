module.exports =
{
    convertTimeStampToDate(timestamp)
    {
        var data = new Date(timestamp);
        var giorno = data.getDate();
        var mese = data.getMonth() + 1;
        var anno = data.getFullYear();
        return giorno + '/' + mese + '/' + anno;
    }
    ,
    convertDateToDateNormal(date)
    {
        return date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear();
    }
    ,
    getRandomEmoji() {
        const randomEmoji = ['🐗','🦢','🐁','🦜','⚔️','🦆','😡','🤬','😵‍💫','🤕','🥺'];
        const indiceCasuale = Math.floor(Math.random() * randomEmoji.length);
        return randomEmoji[indiceCasuale];
      }
}