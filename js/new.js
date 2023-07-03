
const searchTerm = "hoshino_ruby";
const galleryElm = document.querySelector(".gallery");
const overlayElm = document.querySelector(".overlay");
const mainElm = document.querySelector("main");
var rating = "g";

const isInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};


const getImages = async () => {
    const  url = `https://danbooru.donmai.us/posts.json?tags=${encodeURIComponent(searchTerm)}+rating:${encodeURIComponent(rating)}`;

    const data = await (await fetch(url)).json();

    return data
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
};

const addSingleImage = (img) => {
    if(!img.file_url) {
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
    if(throttleTimer) return;

    throttleTimer = true;
    callback();
    setTimeout(() => {
        throttleTimer = false;
    }, time);
};

const handleInfiniteScroll = () => {
    const secondToLastImg = document.querySelector(".gallery a:nth-last-child(2)");
    if(isInViewport(secondToLastImg)) {
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
    var scrollSpeedSmooth = 20; 
    var scrollSpeed = 1; 

    const pageScroll = () => {
        // pause if tab not in focus
        if(document.hasFocus()) {
            requestAnimationFrame(() => mainElm.scrollBy({ left: scrollSpeedSmooth }));
        }
        clearTimeout(autoScrollTimeout); // ensures we don't get a lot of timeouts doing a scroll
        autoScrollTimeout = setTimeout(pageScroll, 10);
    };
    pageScroll();
    // disable is hovered
    const disableOnUserInteraction = () => {
        if(autoScrollTimeout) {
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

    // nfsw
    var clickCount = 0;
    var completed = false;
    const headerElm = document.querySelector(".margins h1");
    headerElm.addEventListener("click", () => {
        if(clickCount > 5 && !completed) {
            completed = true;
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
