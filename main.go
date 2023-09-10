package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func main() {

	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "static/index.html")
	})

	http.HandleFunc("/codewars-stats", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "static/codewars-stats.html")
	})

	http.HandleFunc("/codewars-stats-data", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Loading codewars data!")

		data, err := getCodewarsStats(w, r)

		if err != nil {
			http.Error(w, "error fetching data", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")

		//sort array before sending over to json
		//json.NewEncoder(w).Encode(languageRanks)

		json.NewEncoder(w).Encode(data)
	})

	http.ListenAndServe(":8080", nil)
}

func getCodewarsStats(w http.ResponseWriter, r *http.Request) (MyData, error) {
	url := fmt.Sprintf("https://www.codewars.com/api/v1/users/00raymond")
	resp, err := http.Get(url)
	if err != nil {
		return MyData{}, err
	}
	defer resp.Body.Close() //scheduled to close after the function completes. It's called here in case an error occurs.

	if resp.StatusCode != http.StatusOK {
		return MyData{}, fmt.Errorf("Codewars API request failed with status: %v", resp.Status)
	}

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return MyData{}, err
	}

	var data MyData
	err = json.Unmarshal(bodyBytes, &data) //use bodyBytes that read the json response and convert to struct
	if err != nil {
		return MyData{}, err
	}

	return data, nil
}

type MyData struct { //holds all the json data via UNMARSHALING into struct
	ID             string              `json:"id"`
	Username       string              `json:"username"`
	Honor          int                 `json:"honor"`
	Ranks          Ranks 			   `json:"ranks"`
	TotalCompleted int                 `json:"totalCompleted"`
	LeaderboardPosition int 		   `json:"leaderboardPosition"`
}

type Ranks struct {
	Overall   OverallRank  `json:"overall"`
	Languages map[string]LanguageRank `json:"languages"`
}

type LanguageRank struct {
	Rank  int    `json:"rank"`
	Name  string `json:"name"`
	Color string `json:"color"`
	Score int    `json:"score"`
}

type OverallRank struct {
	Name string `json:"name"`
}
