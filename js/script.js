$(document).ready(function() {
  var searchTerm = "hoshino_ruby"; // Search term with tags and rating
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
      var imagesToShow = Math.min(data.length, 50);
      var loadedImages = 0;

      for (var i = 0; i < imagesToShow; i++) {
        var image = $("<img>").addClass("image").attr("src", data[i].file_url).on("load", function() {
          loadedImages++;
          if (loadedImages === imagesToShow) {
            var containerWidth = rubyimageContainer.width();
            var scrollWidth = imageWrapper.outerWidth();
            var windowInnerHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

            rubyimageContainer.scrollLeft((scrollWidth - containerWidth) / 2);

            // Set the maximum height of the images relative to the window's inner height
            imageWrapper.find(".image").css("max-height", windowInnerHeight-100 + "px");

            // Start scrolling immediately after images are loaded
            rubyimageContainer.animate({ scrollLeft: "+=300" }, 3000);

            setInterval(function() {
              rubyimageContainer.animate({ scrollLeft: "+=500" }, 2000);
            }, 3500);
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

  
  function horizontalLoop(items, config) {
    items = gsap.utils.toArray(items);
    config = config || {};
    let tl = gsap.timeline({repeat: config.repeat, paused: config.paused, defaults: {ease: "none"}, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)}),
      length = items.length,
      startX = items[0].offsetLeft,
      times = [],
      widths = [],
      xPercents = [],
      curIndex = 0,
      pixelsPerSecond = (config.speed || 1) * 100,
      snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
      totalWidth, curX, distanceToStart, distanceToLoop, item, i;
    gsap.set(items, { // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
      xPercent: (i, el) => {
        let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
        xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / w * 100 + gsap.getProperty(el, "xPercent"));
        return xPercents[i];
      }
    });
    gsap.set(items, {x: 0});
    totalWidth = items[length-1].offsetLeft + xPercents[length-1] / 100 * widths[length-1] - startX + items[length-1].offsetWidth * gsap.getProperty(items[length-1], "scaleX") + (parseFloat(config.paddingRight) || 0);
    for (i = 0; i < length; i++) {
      item = items[i];
      curX = xPercents[i] / 100 * widths[i];
      distanceToStart = item.offsetLeft + curX - startX;
      distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
      tl.to(item, {xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond}, 0)
        .fromTo(item, {xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)}, {xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false}, distanceToLoop / pixelsPerSecond)
        .add("label" + i, distanceToStart / pixelsPerSecond);
      times[i] = distanceToStart / pixelsPerSecond;
    }
    function toIndex(index, vars) {
      vars = vars || {};
      (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); // always go in the shortest direction
      let newIndex = gsap.utils.wrap(0, length, index),
        time = times[newIndex];
      if (time > tl.time() !== index > curIndex) { // if we're wrapping the timeline's playhead, make the proper adjustments
        vars.modifiers = {time: gsap.utils.wrap(0, tl.duration())};
        time += tl.duration() * (index > curIndex ? 1 : -1);
      }
      curIndex = newIndex;
      vars.overwrite = true;
      return tl.tweenTo(time, vars);
    }
    tl.next = vars => toIndex(curIndex+1, vars);
    tl.previous = vars => toIndex(curIndex-1, vars);
    tl.current = () => curIndex;
    tl.toIndex = (index, vars) => toIndex(index, vars);
    tl.times = times;
    tl.progress(1, true).progress(0, true); // pre-render for performance
    if (config.reversed) {
      tl.vars.onReverseComplete();
      tl.reverse();
    }
    return tl;
  }