$(document).ready(function() {
    var searchTerm = "hoshino_ruby"; // Search term with tags and rating
    var url = "https://danbooru.donmai.us/posts.json?rating=g&tags=" + encodeURIComponent(searchTerm) + "+" + encodeURIComponent("solo");

    $.getJSON(url, function(data) {
         if (data.length > 0) {
            var rubyimageContainer = document.getElementById("rubyimageContainer");

            // Shuffle the array of data using Fisher-Yates algorithm
            for (var i = data.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = data[i];
                data[i] = data[j];
                data[j] = temp;
            }

            // Display a random selection of images
            var imagesToShow = Math.min(data.length, 20);
            for (var i = 0; i < imagesToShow; i++) {
                var image = document.createElement("img");
                image.className = "image";
                image.src = data[i].file_url;
                rubyimageContainer.appendChild(image);
            }
        } else {
            alert("No images found for the search term: " + searchTerm);
        }
    }).fail(function() {
        alert("Failed to fetch images. Please try again later.");
    });
});