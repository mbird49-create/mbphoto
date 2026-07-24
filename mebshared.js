(function () {
    const siteConfig = {
        brandName: "Michael Bird",
        brandSubtitle: "Photography",
        siteTitle: "Michael Bird Photography",
        footerYear: new Date().getFullYear()
    };

    const navItems = [
        { href: "/index.html", label: "Home" },
        { href: "/mebobservations.html", label: "Observations" },
        { href: "/mebportfolio.html", label: "Portfolio" },
        { href: "/mebabout.html", label: "About" },
        { href: "/mebcontact.html", label: "Contact" }
    ];

    const headerSlot = document.getElementById("site-header");
    const navSlot = document.getElementById("site-nav");
    const footerSlot = document.getElementById("site-footer");

    if (!headerSlot || !navSlot || !footerSlot) {
        return;
    }

    const pageLabel = (document.body.getAttribute("data-page-title") || "").trim();
    if (pageLabel) {
        document.title = pageLabel + " | " + siteConfig.siteTitle;
    }

    const rawPath = window.location.pathname.toLowerCase();
    const isHomeRoute = rawPath === "/" || rawPath === "" || rawPath === "/index.html" || rawPath === "/mebindex.html";
    const currentFile = ("/" + (rawPath.split("/").pop() || "index.html")).toLowerCase();

    const navLinks = navItems
        .map((item) => {
            const isHomeItem = item.href.toLowerCase() === "/index.html";
            const isActive = isHomeItem ? isHomeRoute : item.href.toLowerCase() === currentFile;
            const activeClass = isActive ? " active" : "";
            const ariaCurrent = isActive ? ' aria-current="page"' : "";

            return '<li class="nav-item"><a class="nav-link p-0' + activeClass + '" href="' + item.href + '"' + ariaCurrent + '>' + item.label + '</a></li>';
        })
        .join("");

    headerSlot.innerHTML =
        '<header class="container py-4">' +
        '<a href="/index.html" class="d-inline-flex align-items-center gap-3 text-decoration-none">' +
        '<span class="d-flex align-items-center justify-content-center site-logo-badge">MB</span>' +
        '<span class="d-flex flex-column gap-1">' +
        '<span class="site-logo-name">' + siteConfig.brandName + '</span>' +
        '<span class="site-logo-subtitle">' + siteConfig.brandSubtitle + '</span>' +
        '</span>' +
        '</a>' +
        '</header>';

    navSlot.innerHTML =
        '<header class="head">' +
        '<nav class="mt-3 container">' +
        '<ul class="nav gap-3">' +
        navLinks +
        '</ul>' +
        '</nav>' +
        '</header>';

    footerSlot.innerHTML =
        '<footer class="container py-4">' +
        '<p class="mb-0 text-muted">&copy; ' + siteConfig.footerYear + ' ' + siteConfig.siteTitle + '</p>' +
        '</footer>';
})();

(function () {
    const thumbs = Array.from(document.querySelectorAll("a.gallery-thumb"));
    if (!thumbs.length) {
        return;
    }

    const items = thumbs.map((thumb) => {
        const img = thumb.querySelector("img");
        return { href: thumb.getAttribute("href"), alt: img ? img.getAttribute("alt") || "" : "" };
    });

    const lightbox = document.createElement("div");
    lightbox.className = "meb-lightbox";
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.innerHTML =
        '<button type="button" class="meb-lightbox-close" aria-label="Close">&times;</button>' +
        '<button type="button" class="meb-lightbox-prev" aria-label="Previous image">&larr;</button>' +
        '<img class="meb-lightbox-img" src="" alt="">' +
        '<button type="button" class="meb-lightbox-next" aria-label="Next image">&rarr;</button>';
    document.body.appendChild(lightbox);

    const imgEl = lightbox.querySelector(".meb-lightbox-img");
    const closeBtn = lightbox.querySelector(".meb-lightbox-close");
    const prevBtn = lightbox.querySelector(".meb-lightbox-prev");
    const nextBtn = lightbox.querySelector(".meb-lightbox-next");

    let currentIndex = 0;

    function show(index) {
        currentIndex = (index + items.length) % items.length;
        const item = items[currentIndex];
        imgEl.src = item.href;
        imgEl.alt = item.alt;
    }

    function open(index) {
        show(index);
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("meb-lightbox-active");
    }

    function close() {
        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("meb-lightbox-active");
        imgEl.src = "";
    }

    thumbs.forEach((thumb, index) => {
        thumb.removeAttribute("target");
        thumb.removeAttribute("rel");
        thumb.addEventListener("click", (event) => {
            event.preventDefault();
            open(index);
        });
    });

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", () => show(currentIndex - 1));
    nextBtn.addEventListener("click", () => show(currentIndex + 1));

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            close();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (!lightbox.classList.contains("is-open")) {
            return;
        }
        if (event.key === "Escape") {
            close();
        } else if (event.key === "ArrowLeft") {
            show(currentIndex - 1);
        } else if (event.key === "ArrowRight") {
            show(currentIndex + 1);
        }
    });
})();
