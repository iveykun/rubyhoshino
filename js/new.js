const searchTerm = "hoshino_ruby";
const galleryElm = document.querySelector(".gallery");
const overlayElm = document.querySelector(".overlay");
const mainElm = document.querySelector("main");
var rating = "g";
var SECRET_ON = false;

const isInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};


const getImages = async() => {
    const url = `https://danbooru.donmai.us/posts.json?tags=${encodeURIComponent(searchTerm)}+rating:${encodeURIComponent(rating)}`;

    const data = await (await fetch(url)).json();

    return data
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
};

const addSingleImage = (img) => {
    if (!img.file_url) {
        return;
    }

    const h = img.media_asset.image_height;
    const w = img.media_asset.image_width;

    const linkElm = document.createElement("a");
    linkElm.setAttribute("href", `https://danbooru.donmai.us/posts/${img.id}`);
    linkElm.setAttribute("target", "_blank");
    linkElm.style.setProperty("--img-ratio", `${w} / ${h}`)

    const imgElm = document.createElement("img");
    imgElm.setAttribute("loading", "lazy");
    imgElm.setAttribute("src", img.file_url);
    imgElm.setAttribute("height", h);
    imgElm.setAttribute("width", w);

    linkElm.appendChild(imgElm);
    galleryElm.appendChild(linkElm);
};

// throttle shit
var throttleTimer;
const throttle = (callback, time) => {
    if (throttleTimer) return;

    throttleTimer = true;
    callback();
    setTimeout(() => {
        throttleTimer = false;
    }, time);
};

const handleInfiniteScroll = () => {
    const secondToLastImg = document.querySelector(".gallery a:nth-last-child(2)");
    if (isInViewport(secondToLastImg)) {
        throttle(() => {
            console.log("get new");
            getImages().then((imgs) => {
                imgs.forEach((img) => addSingleImage(img));
            });
        }, 2000);
    }
};

const main = () => {
    getImages().then((imgs) => {
        imgs.forEach((img) => addSingleImage(img));

        mainElm.addEventListener("scroll", handleInfiniteScroll);
    });

    // auto scrolling
    var autoScrollTimeout = null;
    var scrollSpeedMozilla = 20;
    var scrollSpeed = 1;
    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    const pageScroll = () => {
        // pause if tab not in focus
        if (document.hasFocus()) {
            if (isFirefox) {
                requestAnimationFrame(() => mainElm.scrollBy({ left: scrollSpeedMozilla }));
            } else {
                requestAnimationFrame(() => mainElm.scrollBy({ left: scrollSpeed }));
            }
        }
        clearTimeout(autoScrollTimeout); // ensures we don't get a lot of timeouts doing a scroll
        autoScrollTimeout = setTimeout(pageScroll, 10);
    };
    pageScroll();
    // disable is hovered
    const disableOnUserInteraction = () => {
        if (autoScrollTimeout) {
            clearTimeout(autoScrollTimeout);
            // timer to ensure it restarts if no mouseover happens in 5s
            autoScrollTimeout = setTimeout(pageScroll, 5000);
        }
    };
    mainElm.addEventListener("touchmove", () => disableOnUserInteraction());
    mainElm.addEventListener("mouseover", () => disableOnUserInteraction());
    mainElm.addEventListener("mouseleave", () => pageScroll());

    // add handler to scroll overlay
    const scrollUpOverlay = () => overlayElm.scrollBy({ top: 1, behavior: "smooth" });
    document.querySelector(".banner").addEventListener("click", () => scrollUpOverlay());
    document.querySelector(".cover").addEventListener("click", () => scrollUpOverlay());

    var clickCount = 0;
    var completed = false;
    const headerElm = document.querySelector(".margins h1");
    headerElm.addEventListener("click", () => {
        if (clickCount > 5 && !completed) {
            completed = true;
            SECRET_ON = true;
            rating = "s,q,e";
            headerElm.textContent = "Jail of Ruby Hoshino";
            galleryElm.innerHTML = "";
            getImages().then((imgs) => imgs.forEach((img) => addSingleImage(img)));
        } else {
            clickCount++;
        }
    });
};

document.addEventListener("DOMContentLoaded", () => main(), false);
var audio = null;
var playImage = document.getElementById('playImage');
// music
function playAudio() {
    var source = "music/idol-eunha.mp3";
    if (SECRET_ON) {
        source = "music/Mephisto.mp3";
    }
    if (!audio) {
        audio = new Audio(source);
        audio.addEventListener('canplaythrough', function() {
            audio.play();
            updatePlayButtonImage()
        });
    } else {
        if (audio.paused) {
            audio.play();
            updatePlayButtonImage()
        } else {
            audio.pause();
            updatePlayButtonImage()
        }
    }
}

function updatePlayButtonImage() {
    if (audio.paused) {
        console.log("put play image");
        playImage.src = 'img/play.png';
    } else {
        playImage.src = 'img/pause.png';
        console.log("put pause image");

    }
}
// Set the target release day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
var targetReleaseDay = 3; // Wednesday for me 

// Set the target release time (24-hour format)
var targetReleaseHour = 0; // 0:00 (midnight)

// Update the countdown every second
var countdownElement = document.getElementById('countdown');
var countdownInterval = setInterval(updateCountdown, 1000);

function updateCountdown() {
    // Get the current date and time
    var currentDate = new Date();

    // Calculate the next release date and time
    var releaseDateTime = getNextReleaseDateTime(currentDate);

    // Calculate the remaining time until release
    var remainingTime = releaseDateTime.getTime() - currentDate.getTime();

    // If the release time has already passed, calculate the next release date and time
    if (remainingTime <= 0) {
        releaseDateTime = getNextReleaseDateTime(releaseDateTime);
        remainingTime = releaseDateTime.getTime() - currentDate.getTime();
    }

    // Check if the release date is today
    if (isSameDate(currentDate, releaseDateTime)) {
        // Display a special message when the release is today
        countdownElement.textContent = 'The manga chapter should be released today!';
        return;
    }

    // Calculate the remaining days, hours, minutes, and seconds
    var days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    var hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    // Update the countdown element with the remaining time
    countdownElement.textContent = 'The manga chapter should be released in ' + days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, ' + seconds + ' seconds';
}

function getNextReleaseDateTime(currentDate) {
    var releaseDateTime = new Date(currentDate.getTime());

    // Find the next release day
    while (releaseDateTime.getDay() !== targetReleaseDay) {
        releaseDateTime.setDate(releaseDateTime.getDate() + 1);
    }

    // Set the release time
    releaseDateTime.setHours(targetReleaseHour, 0, 0, 0);

    return releaseDateTime;
}

function isSameDate(date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}