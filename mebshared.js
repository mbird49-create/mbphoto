(function () {
    const siteConfig = {
        brandName: "Michael Bird",
        brandSubtitle: "Photography",
        siteTitle: "Michael Bird Photography",
        footerYear: new Date().getFullYear()
    };

    const navItems = [
        { href: "/index.html", label: "Home" },
        { href: "/mebportfolio.html", label: "Portfolio" },
        { href: "/blog.html", label: "Observations" },
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

    const isBlogRoute = rawPath === "/blog.html" || rawPath.indexOf("/blog/") === 0;

    const navLinks = navItems
        .map((item) => {
            const isHomeItem = item.href.toLowerCase() === "/index.html";
            const isBlogItem = item.href.toLowerCase() === "/blog.html";
            const isActive = isHomeItem
                ? isHomeRoute
                : isBlogItem
                ? isBlogRoute
                : item.href.toLowerCase() === currentFile;
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
        '<p class="mb-0 text-muted">&copy; ' + siteConfig.footerYear + ' ' + siteConfig.siteTitle +
        ' · <button type="button" class="cookie-settings-link">Cookie settings</button></p>' +
        '</footer>';
})();

(function () {
    const consentCookie = "mbphoto_cookie_consent";
    const consentMaxAge = 60 * 60 * 24 * 180;

    function getConsent() {
        const match = document.cookie.match(new RegExp("(^|; )" + consentCookie + "=([^;]*)"));
        return match ? decodeURIComponent(match[2]) : "";
    }

    function setConsent(value) {
        document.cookie = consentCookie + "=" + encodeURIComponent(value) +
            "; max-age=" + consentMaxAge + "; path=/; SameSite=Lax";
    }

    function loadConsentScripts() {
        document.querySelectorAll("script[data-cookie-category]").forEach((script) => {
            const replacement = document.createElement("script");
            Array.from(script.attributes).forEach((attribute) => {
                if (attribute.name !== "type" && attribute.name !== "data-cookie-category") {
                    replacement.setAttribute(attribute.name, attribute.value);
                }
            });
            replacement.async = script.async;
            replacement.textContent = script.textContent;
            script.replaceWith(replacement);
        });
    }

    function closeBanner() {
        const banner = document.querySelector(".cookie-consent");
        if (banner) {
            banner.remove();
        }
    }

    function showBanner() {
        closeBanner();
        const banner = document.createElement("aside");
        banner.className = "cookie-consent";
        banner.setAttribute("aria-label", "Cookie notice");
        banner.innerHTML =
            '<div class="cookie-consent-content">' +
            '<p class="mb-2"><strong>Cookies and privacy</strong></p>' +
            '<p class="mb-3">This site uses optional cookies and third-party services for visitor statistics and photo sales. Choose whether to allow them.</p>' +
            '<div class="cookie-consent-actions">' +
            '<button type="button" class="btn btn-sm btn-outline-dark cookie-consent-reject">Reject optional cookies</button>' +
            '<button type="button" class="btn btn-sm btn-dark cookie-consent-accept">Accept optional cookies</button>' +
            '</div>' +
            '</div>';
        document.body.appendChild(banner);
        banner.querySelector(".cookie-consent-reject").addEventListener("click", () => chooseConsent("rejected"));
        banner.querySelector(".cookie-consent-accept").addEventListener("click", () => chooseConsent("accepted"));
    }

    function chooseConsent(value) {
        setConsent(value);
        if (value === "accepted") {
            loadConsentScripts();
        }
        closeBanner();
    }

    function init() {
        if (getConsent() === "accepted") {
            loadConsentScripts();
        } else if (getConsent() !== "rejected") {
            showBanner();
        }

        const settingsLink = document.querySelector(".cookie-settings-link");
        if (settingsLink) {
            settingsLink.addEventListener("click", showBanner);
        }
    }

    // Defer until the full document is parsed so consent-gated <script> tags
    // further down the page (e.g. the Fotomoto widget in <body>) are seen.
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
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
