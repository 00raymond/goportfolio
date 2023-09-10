fetch('/codewars-stats-data')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response not ok');
        }
        return response.json()
    })
    .then(data => {
        document.getElementById('username').textContent = data.Username;
        document.getElementById('honor').textContent = data.Honor;
        document.getElementById('completed').textContent = data.TotalCompleted;
        
        document.getElementById('kyu').textContent = data.Ranks.Overall.Kyu
        const languages = Object.values(data.Ranks.Languages);
        data.languages.forEach(language => {
            console.log(language.Name);
            console.log(language.Score);
        })
        // to do : sort array of languages by languagerank.score, and display score next to them.

    }) .catch(error => {
        console.error('problem fetching', error)
    });