async function scrapeTest() {
    const url = 'https://www.anekdot.ru/random/anekdot/';
    const response = await fetch(url);

    const textFromTheSite = await response.text();
    const topicWithAJoke = textFromTheSite.match(/<div class="topicbox"[\s\S]*?<\/div>\s*<\/div>/g);


    if (!topicWithAJoke) {
        console.log('Элементы не найдены');
        return;
    }
    let anekData = [];

    for (let i = 1; topicWithAJoke[i] != undefined; i++) {
        let result = {
            id: null,
            text: null,
            date: null,
            rating: null,
            tags: null,
            author: null                  
        };

        // ID

        let idMatch = topicWithAJoke[i].match(/id="(\d+)"/);
        result.id = idMatch[1];

        // Текст

        let textMatch = topicWithAJoke[i].match(/<div class="text">(.*?)<\/div>/);
       

        let cleanText = textMatch[1]
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<\/?[^>]+(>|$)/g, '')
                .trim();
        result.text = cleanText;
    
        // Дата
        
        let dateMatch = topicWithAJoke[i].match(/<p class="title"><a [^>]+>([\d.]+)<\/a><\/p>/);
        result.date = dateMatch[1];

        // Рейтинг

        let ratingMatch = topicWithAJoke[i].match(/<div class="rates"[^>]*data-r="(\d+)/);
        result.rating = ratingMatch[1];

        // Тэги

        let tagsMatch = topicWithAJoke[i].match(/<div class="tags"><a[^>]*>([^<]+)<\/a><\/div>/);
        result.tags = tagsMatch ? tagsMatch[1] : [];

        // Автор

        let authorMatch = topicWithAJoke[i].match(/<a class="auth"[^>]*>([^<]+)<\/a>/);
        result.author = authorMatch[1];

        anekData.push(result);
    }
    return anekData;
}

console.log(scrapeTest());
