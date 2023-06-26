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
                        // Function to handle UI updates
                        function handleUIUpdates(scrollPosition) {
                            var containerWidth = rubyimageContainer.width();
                            var scrollWidth = imageWrapper.outerWidth();
                            var windowInnerHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

                            imageWrapper.width(scrollWidth);
                            rubyimageContainer.scrollLeft((scrollWidth - containerWidth) / 2);
                            imageWrapper.find(".image").css("max-height", windowInnerHeight - 100 + "px");

                            // Restore the scroll position
                            rubyimageContainer.scrollLeft(scrollPosition);
                        }
                        // Call the function initially
                        handleUIUpdates(rubyimageContainer.scrollLeft());
                        // Handle window resize event
                        $(window).on("resize", function() {
                            var scrollPosition = rubyimageContainer.scrollLeft();
                            handleUIUpdates(scrollPosition);
                        });
                        // Start scrolling after images are loaded
                        // Initialize counter
                        var scrollCounter = 0;
                        var isAutoscrolling = false;
                        // Start scrolling after images are loaded
                        function startAutoscroll() {
                            isAutoscrolling = true;
                            animateScroll();
                        }

                        // Animation loop for scrolling
                        function animateScroll() {
                            if (!isAutoscrolling) {
                                return;
                            }

                            rubyimageContainer.animate({ scrollLeft: "+=500" }, {
                                duration: 2000,
                                complete: function() {
                                    scrollCounter++;
                                    if (scrollCounter === imagesToShow + 1) {
                                        scrollCounter = 0;
                                        rubyimageContainer.animate({ scrollLeft: "0" }, {
                                            duration: 1000,
                                        });
                                    }
                                    // Delay before starting the next animation cycle
                                    setTimeout(function() {
                                        requestAnimationFrame(animateScroll);
                                    }, 1000); // Adjust the delay as needed
                                }
                            });
                        }


                        // Call the function initially
                        handleUIUpdates(rubyimageContainer.scrollLeft());

                        // Handle window resize event
                        $(window).on("resize", function() {
                            var scrollPosition = rubyimageContainer.scrollLeft();
                            handleUIUpdates(scrollPosition);
                        });

                        // Start autoscrolling
                        startAutoscroll();

                        // move overlay
                        var isScrolling = false;

                        $('.wrapper').on('wheel', function(event) {
                            if (!isScrolling) {
                                isScrolling = true;
                                if (event.originalEvent.deltaY > 0) {
                                    removeOverlay();
                                } else {
                                    $('.overlay').stop().animate({ height: "100vh" }, 200);
                                    // 1 second delay
                                    setTimeout(function() {
                                        $('.vertical-bar-behind').removeClass('hidden');
                                    }, 200);

                                }
                                setTimeout(function() {
                                    isScrolling = false;
                                }, 200); // Adjust the delay as needed
                            }
                        });


                        // Click event handler for images
                        imageWrapper.on("click", ".image", function() {
                            if ($('.vertical-bar-behind').hasClass('hidden')) {
                                var index = $(this).index(".image");
                                var postId = data[index].id;
                                var postUrl = "https://danbooru.donmai.us/posts/" + postId;
                                window.open(postUrl, "_blank");

                            } else {
                                // remove overlay '
                                removeOverlay();
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

    function removeOverlay() {

        $('.overlay').stop().animate({ height: "0" }, 200);
        $('.vertical-bar-behind').addClass('hidden');
    }


});