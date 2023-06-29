var secretCode = false;

function mainFunction(rating) {
    console.log(rating);
    // Initialize counter
    var autoscrollCount = 0;
    var isAutoscrolling = false;

    var rubyimageContainer = $("#rubyimageContainer");
    var imageWrapper = $("<div>").addClass("image_wrapper"); // Create a new wrapper element

    var searchTerm = "hoshino_ruby"; // Search term with tags and G rating
    var url = "https://danbooru.donmai.us/posts.json?tags=" + encodeURIComponent(searchTerm) + "+rating:" + encodeURIComponent(rating);

    // Click event handler for Reddit button
    $(".social-button.reddit").on("click", function() {
        var redditUrl = "https://www.reddit.com/r/ChurchOfRubyHoshino/";
        window.open(redditUrl, "_blank");
    });
    rubyimageContainer.append(imageWrapper); // Append the wrapper to the container

    function displayImages(data, amount_of_pics) {
        // Display a random selection of images
        var imagesToShow = Math.min(data.length, amount_of_pics);
        var loadedImages = 0;

        // Empty the imageWrapper to remove existing images
        imageWrapper.empty();
        for (var i = 0; i < imagesToShow; i++) {
            var image = $("<img>").addClass("image").attr("src", data[i].file_url).on("load", function() {
                loadedImages++;

                handleUIUpdates(rubyimageContainer.scrollLeft());
                if (loadedImages === imagesToShow) {

                    // Call the function initially
                    handleUIUpdates(rubyimageContainer.scrollLeft());
                    handleLogoUpdates();

                    // Handle window resize event
                    $(window).on("resize", function() {
                        var scrollPosition = rubyimageContainer.scrollLeft();
                        handleUIUpdates(scrollPosition);
                        handleLogoUpdates();
                    });

                    // Start autoscrolling
                    startAutoscroll(imagesToShow);

                    // Move overlay when scrolling over wrapper
                    var isScrollingOverlay = false;

                    $('.wrapper').on('wheel', function(event) {
                        if (!isScrollingOverlay) {
                            isScrollingOverlay = true;
                            if (event.originalEvent.deltaY > 0) {
                                removeOverlay();
                            } else {
                                addOverlay();
                            }
                            setTimeout(function() {
                                isScrollingOverlay = false;
                            }, 300); // Adjust the delay as needed
                        }
                    });

                    $('.vertical-bar-behind').on('click', function() {
                        if ($('.vertical-bar-behind').hasClass('hidden')) {
                            // This means that the overlay had been hidden beforehand
                            addOverlay();
                        } else {
                            removeOverlay();
                        }
                    });

                    var clickCounterHeader = 0;
                    $('.header').on('click', function() {
                        clickCounterHeader++;
                        if (clickCounterHeader == 9) {
                            console.log("test");
                            secretCode = true;
                            // Remove the existing image_wrapper
                            rubyimageContainer.find(".image_wrapper").remove();

                            mainFunction("s,q,e");
                            $("#dynamicHeading").text("Jail of Ruby Hoshino");
                            //showPopupMessage("NSFW ON", 3000);
                            return;
                        }
                    });
                    // Dragging variables
                    var isDragging = false;
                    var startPosX = 0;
                    var currentPosX = 0;
                    var scrollLeft = 0;
                    // Touch events for dragging overlay on mobile devices
                    $(document).on('touchstart', function(event) {
                        if ($('.overlay').hasClass('hidden')) {
                            return;
                        }
                        event.preventDefault();
                        isDragging = true;
                        startPosX = event.originalEvent.touches[0].pageX;
                        scrollLeft = rubyimageContainer.scrollLeft();
                        pauseAutoscroll();
                    });

                    $(document).on('touchmove', function(event) {
                        if (isDragging) {
                            event.preventDefault();
                            currentPosX = event.originalEvent.touches[0].pageX;
                            var moveX = startPosX - currentPosX;
                            rubyimageContainer.scrollLeft(scrollLeft + moveX);
                        }
                    });

                    $(document).on('touchend', function(event) {
                        if (isDragging) {
                            isDragging = false;
                            resumeAutoscrollWithDelay(2000); // Delay in milliseconds before resuming autoscroll
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
                            // Remove overlay
                            removeOverlay();
                        }
                    });
                }
            });
            image.css("height", "100% !important");
            imageWrapper.append(image);
        }
    }

    // Function to pause autoscroll
    function pauseAutoscroll() {
        clearInterval(autoscrollInterval);
    }

    // Function to resume autoscroll with a delay
    function resumeAutoscrollWithDelay(delay) {
        setTimeout(function() {
            startAutoscroll();
        }, delay);
    }


    function shuffleArray(array) {
        // Shuffle the array using Fisher-Yates algorithm
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    function handleLogoUpdates() {
        var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var redditButton = document.querySelector(".social-button.reddit");

        if (screenWidth < 1368) {
            redditButton.classList.add("small-screen");
        } else {
            redditButton.classList.remove("small-screen");
        }
    }

    function removeOverlay() {

        $('.overlay').stop().animate({ height: "0" }, 200);
        $('.vertical-bar-behind').addClass('hidden');
    }

    function addOverlay() {
        $('.overlay').stop().animate({ height: "100vh" }, 200);
        // 1 second delay
        setTimeout(function() {
            $('.vertical-bar-behind').removeClass('hidden');
        }, 200);
    }
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

    function startAutoscroll(imagesToShow) {
        isAutoscrolling = true;
        animateScroll(imagesToShow);
    }

    function showPopupMessage(message, duration) {
        var popupMessage = $("#popupMessage");
        var popupText = $("#popupText");

        // Set the message text
        popupText.text(message);

        // Show the popup message
        popupMessage.addClass("show");

        // Hide the popup message after the specified duration
        setTimeout(function() {
            popupMessage.removeClass("show");
        }, duration);
    }

    // Animation loop for scrolling
    function animateScroll(imagesToShow) {
        if (!isAutoscrolling) {
            return;
        }

        rubyimageContainer.animate({ scrollLeft: "+=500" }, {
            duration: 2000,
            complete: function() {
                autoscrollCount++;
                console.log(autoscrollCount);
                if (autoscrollCount >= imagesToShow) {
                    console.log("activated");
                    autoscrollCount = 0;
                    rubyimageContainer.animate({ scrollLeft: "0" }, {
                        duration: 1000,
                    });
                }
                // Delay before starting the next animation cycle
                setTimeout(function() {
                    requestAnimationFrame(function() {
                        animateScroll(imagesToShow); // Call the function recursively
                    });
                }, 1000); // Adjust the delay as needed
            }
        });
    }
    // main code 
    $.getJSON(url, function(data) {
        if (data.length > 0) {
            shuffleArray(data);

            var amount_of_pics = 50;
            displayImages(data, amount_of_pics);
        } else {
            alert("No images found for the search term: " + searchTerm);
        }
    }).fail(function() {
        alert("Failed to fetch images. Please try again later.");
    });

}

$(document).ready(function() {
    mainFunction("g");
});