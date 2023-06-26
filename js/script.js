$(document).ready(function() {
    var searchTerm = "hoshino_ruby"; // Search term with tags and G rating
    var url = "https://danbooru.donmai.us/posts.json?tags=" + encodeURIComponent(searchTerm) + "+rating:" + encodeURIComponent("g");

    $.getJSON(url, function(data) {
        if (data.length > 0) {
            var rubyimageContainer = $("#rubyimageContainer");
            var imageWrapper = $("<div>").addClass("image_wrapper"); // Create a new wrapper element
            rubyimageContainer.append(imageWrapper); // Append the wrapper to the container

            // Shuffle the array of data using Fisher-Yates algorithm
            for (var i = data.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = data[i];
                data[i] = data[j];
                data[j] = temp;
            }

            // Display a random selection of images
            var amount_of_pics = 50;
            var imagesToShow = Math.min(data.length, amount_of_pics);
            var loadedImages = 0;

            for (var i = 0; i < imagesToShow; i++) {
                var image = $("<img>").addClass("image").attr("src", data[i].file_url).on("load", function() {
                    loadedImages++;
                    if (loadedImages === imagesToShow) {
                        var containerWidth = rubyimageContainer.width();
                        var scrollWidth = imageWrapper.outerWidth();
                        var windowInnerHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

                        // Set the wrapper width to accommodate all images
                        imageWrapper.width(scrollWidth);

                        rubyimageContainer.scrollLeft((scrollWidth - containerWidth) / 2);

                        // Set the maximum height of the images relative to the window's inner height
                        imageWrapper.find(".image").css("max-height", windowInnerHeight - 100 + "px");

                        // Start scrolling immediately after images are loaded
                        rubyimageContainer.animate({ scrollLeft: "+=300" }, 3000);

                        // Start scrolling immediately after images are loaded
                        // Initialize counter
                        var scrollCounter = 0;

                        setInterval(function() {
                            rubyimageContainer.animate({ scrollLeft: "+=500" }, {
                                duration: 2000,
                                complete: function() {
                                    scrollCounter++; // Increment the scroll counter
                                    if (scrollCounter === imagesToShow + 1) {
                                        scrollCounter = 0; // Reset the scroll counter
                                        // Smoothly scroll back to the beginning
                                        rubyimageContainer.animate({ scrollLeft: "0" }, {
                                            duration: 1000,
                                        });
                                    }
                                }
                            });
                        }, 3500); // wait time
                        // move overlay
                        var lastScrollTop = 0;
                        $('.wrapper').on('scroll', function() {
                            var scrollTop = $(this).scrollTop();
                            if (scrollTop > lastScrollTop) {
                                $('.overlay').stop().animate({ height: "0" }, 200);
                            } else {
                                $('.overlay').stop().animate({ height: "100vh" }, 200);
                            }
                        });
                    }
                });

                imageWrapper.append(image);
            }
        } else {
            alert("No images found for the search term: " + searchTerm);
        }
    }).fail(function() {
        alert("Failed to fetch images. Please try again later.");
    });
});