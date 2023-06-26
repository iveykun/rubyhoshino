$(document).ready(function() {
    var searchTerm = "hoshino_ruby"; // Search term with tags and rating
    var url = "https://danbooru.donmai.us/posts.json?rating=s&tags=" + encodeURIComponent(searchTerm) + "+" + encodeURIComponent("solo");

    $.getJSON(url, function(data) {
        if (data.length > 0) {
            var rubyimageContainer = document.getElementById("rubyimageContainer");

            for (var i = 0; i < data.length; i++) {
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