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
