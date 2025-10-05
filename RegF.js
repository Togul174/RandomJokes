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

    topicWithAJoke.forEach((item) => {
        let result = {
            id: null,
            text: null,
            date: null,
            rating: null,
            tags: null,
            author: null                  
        };

        // ID

        let idMatch = item.match(/id="(\d+)"/);
        result.id = idMatch ? idMatch[1] : null;

        // Текст

        let textMatch = item.match(/<div class="text">(.*?)<\/div>/);
       

        result.text = textMatch ? textMatch[1]
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<\/?[^>]+(>|$)/g, '')
                .trim() : null;
    
        // Дата
        
        let dateMatch = item.match(/<p class="title"><a [^>]+>([\d.]+)<\/a><\/p>/);
        result.date = dateMatch ? dateMatch[1] : null;

        // Рейтинг

        let ratingMatch = item.match(/<div class="rates"[^>]*data-r="(\d+)/);
        result.rating = ratingMatch ? ratingMatch[1] : null;

        // Тэги

        let tagsMatch = item.match(/<div class="tags"><a[^>]*>([^<]+)<\/a><\/div>/);
        result.tags = tagsMatch ? tagsMatch[1] : [];

        // Автор

        let authorMatch = item.match(/<a class="auth"[^>]*>([^<]+)<\/a>/);
        result.author = authorMatch ? authorMatch[1] : null;

        anekData.push(result);
    });
    return anekData;
}

let finish = async () => {
    const data = await scrapeTest();
    console.log(data);
};

finish();